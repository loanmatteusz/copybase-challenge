import React, { useState } from "react";
import axios from "axios";
import { Card, Group, Text } from "@mantine/core";
import { CustomResponse } from "../interfaces/CustomResponse";

import { BarChart } from "../components/BarChart";
import { Upload } from "../components/Upload";
import { CustomCard } from "../components/CustomCard";

import { URL } from "../constraints/url";


export const Dash: React.FC<{ data: CustomResponse }> = ({ data }) => {
  const labels = data.payersByMonth.map(mrr => mrr.yearMonth);
  const mrrData = data.payersByMonth.map(mrr => mrr.totalMonthlyMrr);

  const [loading, setLoading] = useState<boolean>(false);
  const [reupload, setReupload] = useState<CustomResponse>();
  const onFileSelected = async (fileSelected: File) => {
    const formData = new FormData();
    formData.append('file', fileSelected);
    try {
      setLoading(true);
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReupload(response.data);
      setLoading(false);
    } catch (error) {
      console.log({ error });
    }
  }

  const getChrunMrr = (value: number) => {
    if (value === 0) {
      return value;
    }
    return (-value)
  }

  return (
    <>
      <h1>Dashboard</h1>
      <Group
        align="center"
        justify="space-between"
      >
        <CustomCard title="Total MRR" value={reupload?.totalMrr || data.totalMrr} />
        <CustomCard title="New MRR" value={reupload?.newMrrValue || data.newMrrValue} />
        <CustomCard title="Chrun MRR" value={getChrunMrr(reupload?.churnMrrValue || data.churnMrrValue)} />
        <Card
          shadow="sm" padding="md" radius="sm"
          w={240}
          h={140}
        >
          <Text
            size="xl"
            fw="bold"
          >
            New Upload
          </Text>
          <Upload
            onFileSelected={onFileSelected}
            placeholder="Choose other file"
            fileLoading={loading}
          />
        </Card>
      </Group>
      {
        reupload ?
          <BarChart
            data={reupload.payersByMonth.map(mrr => mrr.totalMonthlyMrr)}
            labels={reupload.payersByMonth.map(mrr => mrr.yearMonth)}
          /> :
          <BarChart
            data={mrrData}
            labels={labels}
          />
      }
    </>
  );
}
