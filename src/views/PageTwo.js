// material
import { Container, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function PageTwo() {
  const [text, setText] = useState();
  const [stateOptions, setStateValues] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [hostname, setHostname] = useState();
  const [domain, setDomain] = useState();
  const [processorCount, setProcessorCount] = useState();
  const [architecture, setArchitecture] = useState();
  const [totalFiles, setTotalFiles] = useState();
  const [totalAmountData, setTotalAmountData] = useState();
  const [eachFileType, setEachFileType] = useState();

  const test = (e) => {
    console.log(e.target.files);
  };

  let fileReader;

  const onChange = (e) => {
    const file = e.target.files;
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file[0]);
  };

  const onAnalyse = () => {
    console.log('analyse');
    let loading = false;
    let totalfilenumber = 0;
    let totalfilesize = 0;
    const eachfiletype = [];
    for (let i = 0; i < stateOptions.length; i += 1) {
      // get Last loading time
      if (stateOptions[i].includes('FINISHED LOGGING')) {
        console.log(stateOptions[i].split(']')[0].substring(1));
        const startDate = stateOptions[i].split(']')[0].substring(1);
        const time = startDate.split(' ')[0];
        console.log(time);
        const date = `${new Date().getFullYear()}-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[0]
        }-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[1]
        }`;
        console.log(date);
        setEndDate(`${date}T${time}`);
        loading = false;
      }

      if (loading) {
        totalfilenumber += 1;
        totalfilesize += stateOptions[i].split(', ')[1];
        let extension = 'Non-FileType';
        if (stateOptions[i].split(', ')[0].split('.').length > 1) {
          extension = stateOptions[i].split(', ')[0].split('.')[
            stateOptions[i].split(', ')[0].split('.').length - 1
          ];
        }

        const temp = {
          filetype: extension,
          filesize: parseInt(stateOptions[i].split(', ')[1], 20)
        };
        console.log(eachfiletype.length);
        if (eachfiletype.length === 0) eachfiletype[0] = temp;
        else {
          let findfiletypeflag = true;
          for (let j = 0; j < eachfiletype.length; j += 1) {
            if (eachfiletype[j].filetype === temp.filetype) {
              eachfiletype[j].filesize += temp.filesize;
              findfiletypeflag = false;
            }
          }
          if (findfiletypeflag) {
            eachfiletype[eachfiletype.length] = temp;
          }
        }
      }

      // get first Loading time
      if (stateOptions[i].includes('STARTING LOGGING')) {
        console.log(stateOptions[i].split(']')[0].substring(1));
        const startDate = stateOptions[i].split(']')[0].substring(1);
        const time = startDate.split(' ')[0];
        console.log(time);
        const date = `${new Date().getFullYear()}-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[0]
        }-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[1]
        }`;
        console.log(date);
        setStartDate(`${date}T${time}`);
        loading = true;
      }

      // hostname
      if (stateOptions[i].includes('HOSTNAME')) {
        setHostname(stateOptions[i].split(':')[1]);
      }

      // domain
      if (stateOptions[i].includes('DOMAIN')) {
        setDomain(stateOptions[i].split(':')[1]);
      }

      // procesrcount
      if (stateOptions[i].includes('PROCESRCOUNT')) {
        setProcessorCount(stateOptions[i].split(':')[1]);
      }

      // architeccture
      if (stateOptions[i].includes('ARCHITECTURE')) {
        setArchitecture(stateOptions[i].split(':')[1]);
      }
    }
    setEachFileType(eachfiletype);
    setTotalFiles(totalfilenumber);
    setTotalAmountData(totalfilesize);
  };

  const deleteLines = (string, n = 1) => {
    console.log('remove lines');
    return string.replace(new RegExp(`(?:.*?\n){${n - 1}}(?:.*?\n)`), '');
  };

  const cleanContent = (string) => {
    string = string.replace(/^\s*[\r\n]/gm, '');
    const array = string.split(new RegExp(/[\r\n]/gm));
    console.log(array);
    setStateValues(array);
    return array.join('\n');
  };

  const handleFileRead = (e) => {
    let content = fileReader.result;
    // let text = deleteLines(content, 3);
    content = cleanContent(content);
    // … do something with the 'content' …
    setText(content);
  };

  return (
    <Page title="Get Info">
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          Read text and analyse
        </Typography>
        <input type="file" name="myfile" onChange={onChange} />
        <button onClick={onAnalyse}>Analyse</button>
        {text && <pre>{text}</pre>}
      </Container>
    </Page>
  );
}
