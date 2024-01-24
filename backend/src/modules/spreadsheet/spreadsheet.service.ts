import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from "fs";

import { File } from './interfaces/File';
import { Subscriber } from './interfaces/Subscriber';
import { MonthlyPayers } from './interfaces/MonthlyPayers';
import { MrrByMonth } from './interfaces/MrrByMonth';
import { parseXlsxOrCsvToJson } from './utils/parseXlsxOrCsvToJson';


@Injectable()
export class SpreadsheetService {
  async processSheet(file: File) {
    try {
      const subscribers: Subscriber[] = await parseXlsxOrCsvToJson(file);
      const payerByMonth = this.getPaymentByMonth(subscribers);
      const months = Array.from(Object.keys(payerByMonth));
      const monthlyPayers: MonthlyPayers[] = months.map((month: string) => ({
        month,
        payers: payerByMonth[month],
      }));

      const plans = this.getSubscribersPlans(subscribers);
      const mrrByMonth = this.getMrrByMonth(monthlyPayers, plans);
      const totalMrr = mrrByMonth.reduce((acc, curr) => acc + curr.totalMonthlyMrr, 0);

      const currMonth = months.find(month => (new Date(`${month}-29`).getMonth()) === new Date().getMonth());
      const newMrr = this.getNewMrr(monthlyPayers, currMonth);
      const churnMrr = this.getChurnMrr(monthlyPayers, currMonth);

      return {
        totalMrr,
        newMrr,
        churnMrr,
        mrrByMonth,
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    } finally {
      fs.unlink(file.path, (err) => {
        if (err) console.log({ err });
      });
    }
  }


  private getSubscribersPlans(subscribers: Subscriber[]): string[] {
    const plans = new Set<string>();
    subscribers.forEach((sub => plans.add(sub.plan_type)));
    return Array.from(plans);
  }

  private getMrrByMonth(monthlyPayers: MonthlyPayers[], plans: string[]): MrrByMonth[] {
    return monthlyPayers.map(monthlyPayer => {
      const mrrByPlan = plans.map(plan => this.getMrrByPlan(plan, monthlyPayer.payers));
      const totalMonthlyMrr = mrrByPlan.reduce((acc, curr) => acc + curr, 0);
      return {
        month: monthlyPayer.month,
        totalMonthlyMrr,
      }
    });
  }

  private getMrrByPlan(plan: string, subscribers: Subscriber[]): number {
    const subsFilter = subscribers.filter(sub => sub.plan_type === plan);
    return subsFilter.reduce((acc, curr) => {
      if (curr.plan_type && curr.payment) {
        return acc + curr.payment;
      }
      return acc;
    }, 0);
  }

  private getPaymentByMonth(subscribers: Subscriber[]): Record<string, Subscriber[]> {
    const payerByMonth: Record<string, Subscriber[]> = {};
    const currDate = new Date();
    const earliestDate = new Date(Math.min(...subscribers.map(subscriber => subscriber.register_date.getTime())));
    const limitDate = new Date(currDate.getFullYear(), currDate.getMonth() + 6, 0);

    let currDateIteration = new Date(earliestDate);
    while (currDateIteration <= limitDate) {
      const monthlyPayers = subscribers.filter(subscriber => {
        const registerDate = new Date(subscriber.register_date);
        const cancelDate = subscriber.cancel_date ? new Date(subscriber.cancel_date) : undefined;
        return registerDate.getMonth() <= currDateIteration.getMonth() && (!cancelDate || cancelDate > currDateIteration);
      });
      payerByMonth[currDateIteration.toISOString().slice(0, 7)] = monthlyPayers;
      currDateIteration.setMonth(currDateIteration.getMonth() + 1);
    }
    return payerByMonth;
  }

  private getNewMrr(monthlyPayers: MonthlyPayers[], currMonth: string) {
    return monthlyPayers
      .find(monthlyPayer => monthlyPayer.month === currMonth)
      .payers.reduce((acc, curr) => acc + curr.payment, 0);
  }

  private getChurnMrr(monthlyPayers: MonthlyPayers[], currMonth: string): number {
    return monthlyPayers.
      map(monthlyPayer => {
        const payers = monthlyPayer.payers.filter(payer => {
          const cancelDateMonth = new Date(payer.cancel_date).getMonth();
          const currDateMonth = new Date(`${currMonth}-29`).getMonth();
          return cancelDateMonth === currDateMonth ?? payer;
        });
        const payer = payers.find(payer => payer.cancel_date);
        return payer;
      })
      .filter(payer => payer)
      .reduce((acc, curr) => acc + curr.payment, 0);
  }
}
