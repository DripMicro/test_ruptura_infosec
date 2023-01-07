// material
import { Container, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

// components
import Page from '../components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  input: {
    display: 'none'
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  card: {
    maxWidth: 345
  }
}));

// ----------------------------------------------------------------------

export default function PageTwo() {
  const classes = useStyles();

  const [text, setText] = useState();
  const [stateOptions, setStateValues] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [takeTime, setTakeTime] = useState();
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
    let startloadingdate = '';
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
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[1]
        }-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[0]
        }`;
        console.log(date);
        setEndDate(`${date}T${time}`);
        const dateOneObj = new Date(startloadingdate);
        const dateTwoObj = new Date(`${date}T${time}`);
        console.log(dateOneObj);
        console.log(dateTwoObj);
        let delta = Math.abs(dateTwoObj - dateOneObj) / 1000;

        // calculate (and subtract) whole days
        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        const seconds = delta % 60;
        console.log(hours);
        setTakeTime(
          `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
        );
        loading = false;
      }

      if (loading) {
        totalfilenumber += 1;
        totalfilesize += parseInt(stateOptions[i].split(', ')[1], 20);
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
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[1]
        }-${
          stateOptions[i].split(']')[0].substring(1).split(' ')[1].split(':')[0]
        }`;
        console.log(date);
        setStartDate(`${date}T${time}`);
        startloadingdate = `${date}T${time}`;
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

  const onClear = () => {
    setText('');
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
          Read file and analyse
        </Typography>

        <label htmlFor="icon-button-file">
          <input
            accept="text/*"
            className={classes.input}
            id="icon-button-file"
            type="file"
            name="myfile"
            onChange={onChange}
          />
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
          >
            <CloudUploadIcon />
          </IconButton>
        </label>
        <Button
          variant="contained"
          color="error"
          className={classes.button}
          onClick={onClear}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={onAnalyse}
        >
          Analyse
        </Button>
        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item sm={3} xs={6}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    The Targets
                  </Typography>
                  <img
                    src="/static/image/mac.png"
                    alt="Contemplative Reptile"
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Discription
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={9} xs={6}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Info
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    <Grid container spacing={3}>
                      <Grid item sm={6}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          Targets in scope
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="span"
                        >
                          Discription
                        </Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Discription
                        </Typography>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        {text && <pre>{text}</pre>}
        {startDate}
        <br />
        {endDate}
        <br />
        {hostname}
        <br />
        {domain}
        <br />
        {processorCount}
        <br />
        {architecture}
        <br />
        {totalFiles}
        <br />
        {totalAmountData}
        <br />
        {takeTime}
      </Container>
    </Page>
  );
}
