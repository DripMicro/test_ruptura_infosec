// material
import { Container, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function PageTwo() {
  const [text, setText] = useState();

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

  const deleteLines = (string, n = 1) => {
    console.log('remove lines');
    return string.replace(new RegExp(`(?:.*?\n){${n - 1}}(?:.*?\n)`), '');
  };

  const cleanContent = (string) => {
    string = string.replace(/^\s*[\r\n]/gm, '');
    const array = string.split(new RegExp(/[\r\n]/gm));
    console.log(array);
    array.splice(0, 3);
    array.splice(-3);
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
        {text && <pre>{text}</pre>}
      </Container>
    </Page>
  );
}
