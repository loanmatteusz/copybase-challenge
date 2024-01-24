import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dash, MrrByMonth } from './pages/Dash';
import { Upload } from './components/Upload';

import './App.css';

const URL = `http://localhost:3000/api/v1/spreadsheet/upload`;

export interface CustomResponse {
  totalMrr: number;
  newMrr: number;
  churnMrr: number;
  mrrByMonth: MrrByMonth[];
}

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
        !data && <Upload onFileSelected={onFileSelected}/>
      }
      {
        data && <>
          <Dash data={data.mrrByMonth} />
        </>
      }
    </>
  );
}

export default App;
