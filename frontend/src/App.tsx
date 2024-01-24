import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dash } from './pages/Dash';
import { Upload } from './components/Upload';
import { CustomResponse } from './interfaces/CustomResponse';

import { URL } from './constraints/url';
import { Flex, Text } from '@mantine/core';

import './App.css';

function App() {
  const [data, setData] = useState<CustomResponse>();

  const onFileSelected = async (fileSelected: File) => {
    const formData = new FormData();
    formData.append('file', fileSelected);
    try {
      const response = await axios.post(URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data);
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <>
      {
        !data &&
        <Flex
          direction="column"
          gap={10}
        >
          <Text
            fw="bold"
            size="xl"
          >
            Just get a .xlsx or .csv file
          </Text>
          <Upload onFileSelected={onFileSelected} placeholder='Choose your file .xlsx or .csv' />
        </Flex>
      }
      {
        data && <>
          <Dash data={data} />
        </>
      }
    </>
  );
}

export default App;
