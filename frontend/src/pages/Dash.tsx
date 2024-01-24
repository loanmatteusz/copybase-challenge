import React, { useState } from "react";
import axios from "axios";
import { Card, Group, Text } from "@mantine/core";
import { CustomResponse } from "../interfaces/CustomResponse";

import { BarChart } from "../components/BarChart";
import { Upload } from "../components/Upload";
import { CustomCard } from "../components/CustomCard";

import { URL } from "../constraints/url";


export const Dash: React.FC<{ data: CustomResponse }> = ({ data }) => {
  const labels = data.mrrByMonth.map(mrr => mrr.month);
  const mrrData = data.mrrByMonth.map(mrr => mrr.totalMonthlyMrr);

  const [reupload, setReupload] = useState<CustomResponse>();
  const onFileSelected = async (fileSelected: File) => {
    const formData = new FormData();
    formData.append('file', fileSelected);
    try {
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setReupload(response.data);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <>
      <h1>Dashboard</h1>
      <Group
        align="center"
        justify="space-between"
      >
        <CustomCard title="Total MRR" value={reupload?.totalMrr || data.totalMrr} />
        <CustomCard title="New MRR" value={reupload?.newMrr || data.newMrr} />
        <CustomCard title="Chrun MRR" value={reupload?.churnMrr || data.churnMrr} />
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
          />
        </Card>
      </Group>
      {
        reupload ?
          <BarChart
            data={reupload.mrrByMonth.map(mrr => mrr.totalMonthlyMrr)}
            labels={reupload.mrrByMonth.map(mrr => mrr.month)}
          /> :
          <BarChart
            data={mrrData}
            labels={labels}
          />
      }
    </>
  );
}
