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
        yearMonth: month,
        payers: payerByMonth[month],
      }));

      const plans = this.getSubscribersPlans(subscribers);
      const payersByMonth = this.getMrrByMonth(monthlyPayers, plans);

      const totalMrr = payersByMonth.reduce((acc, curr) => acc + curr.totalMonthlyMrr, 0);

      const currYearMonth = months.find(monthly => {
        const [year, month] = monthly.split("-");
        const dateBymonthly = new Date(Number(year), Number(month)-1);
        const today = new Date();
        return (dateBymonthly.getFullYear() === today.getFullYear() && dateBymonthly.getMonth() === today.getMonth())
      });

      const { newMrrValue } = this.getNewMrr(monthlyPayers, currYearMonth);
      
      const cancelSubs = subscribers.filter(payer => payer.cancel_date);

      const { cancelValue: churnMrrValue } = this.getChurnMrr(cancelSubs, currYearMonth);
      
      return {
        totalMrr,
        newMrrValue,
        churnMrrValue,
        payersByMonth,
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
        yearMonth: monthlyPayer.yearMonth,
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

  private formatMonth = (month: number) => month < 10 ? `0${month}` : month;

  private getNewMrr(monthlyPayers: MonthlyPayers[], currYearMonth: string) {
    const monthlyPayersInThisMonth = monthlyPayers
      .find(monthlyPayer => monthlyPayer.yearMonth === currYearMonth)
      .payers;
    const newMrrValue = monthlyPayersInThisMonth
      .reduce((acc, curr) => acc + curr.payment, 0);
    const newPayersQuantity = monthlyPayersInThisMonth.filter(payer => {
      const payerRegistration = new Date(payer.register_date);
      
      const payerYearMonth = `${payerRegistration.getFullYear()}-${this.formatMonth(payerRegistration.getMonth()+1)}`
      return payerYearMonth === currYearMonth;
    });
    return {
      newMrrValue,
      newPayers: newPayersQuantity.length,
    }
  }

  private getChurnMrr(cancelSubscribers: Subscriber[], currMonth: string): {cancelValue: number, cancelPayers: number} {
    const cancelSubsInThisMonth = cancelSubscribers
      .filter(sub => new Date(sub.cancel_date).getMonth() === new Date(`${currMonth}-29`).getMonth());

    const cancelValue = cancelSubsInThisMonth
      .reduce((acc, curr) => acc + curr.payment, 0);

    return {
      cancelValue,
      cancelPayers: cancelSubsInThisMonth.length,
    }
  }
}
