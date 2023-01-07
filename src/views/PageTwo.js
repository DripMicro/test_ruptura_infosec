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
  },
  overScroll: {
    overflowY: 'scroll',
    maxHeight: '500px'
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
  const [eachFileType, setEachFileType] = useState([]);
  const [processing, setProcessing] = useState([]);

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
    const processNumber = 0;
    const eachfiletype = [];
    const processsRunning = [];
    let processPidTemp = '';
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
        let setTextTime = '';
        if (days !== 0) setTextTime += `${days} Days `;
        if (hours !== 0) setTextTime += `${hours} Hours `;
        if (minutes !== 0) setTextTime += `${minutes} Minutes `;
        setTextTime += `${seconds} Seconds`;

        setTakeTime(setTextTime);
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

      // get Process Running
      if (stateOptions[i].includes('--->PID:')) {
        processPidTemp = stateOptions[i];
      }

      if (stateOptions[i].includes('RUNNING:') && processPidTemp !== '') {
        console.log(processsRunning);
        processsRunning.push({ pid: processPidTemp, running: stateOptions[i] });
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
    setProcessing(processsRunning);
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

  const formatBytes = (bits, decimals = 2) => {
    if (!+bits) return '0 Bytes';

    const bytes = Math.floor(bits / 8);
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
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
                    align="center"
                  >
                    {hostname}
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
                    <br />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Targets in scope :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              1
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              successfully compromised :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              1
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Files encrypted :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {totalFiles}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Total file size encrypted :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {formatBytes(totalAmountData)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Architecture :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {architecture}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Processor Count :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {processorCount}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={6}>
                            <Typography variant="h6" component="h2">
                              Domain :
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {domain}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={8}>
                            <Typography variant="h6" component="h2">
                              Time Taken :
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {takeTime}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={3}>
                            <Typography variant="h6" component="h2">
                              Date Started :
                            </Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {startDate}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={3}
                          justifyContent="space-between"
                        >
                          <Grid item xs={3}>
                            <Typography variant="h6" component="h2">
                              Date finished :
                            </Typography>
                          </Grid>
                          <Grid item xs={9}>
                            <Typography
                              variant="h6"
                              color="Warning"
                              component="span"
                            >
                              {endDate}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Total number of each file type
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.overScroll}
                  >
                    <Grid container spacing={3} justifyContent="space-between">
                      {eachFileType.map((data) => (
                        <Grid item xs={12} key={data.filetype}>
                          <Grid
                            container
                            spacing={3}
                            justifyContent="space-between"
                          >
                            <Grid item xs={8}>
                              <Typography
                                variant="h6"
                                color="textSecondary"
                                component="span"
                              >
                                {data.filetype}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography
                                variant="h6"
                                color="textSecondary"
                                component="span"
                              >
                                {formatBytes(data.filesize)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Process Running
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.overScroll}
                  >
                    <Grid container spacing={3} justifyContent="space-between">
                      {processing.map((data) => (
                        <Grid item xs={12} key={data.pid}>
                          <Grid
                            container
                            spacing={3}
                            justifyContent="space-between"
                          >
                            <Grid item xs={5}>
                              <Typography
                                variant="h6"
                                color="textSecondary"
                                component="span"
                              >
                                {data.pid}
                              </Typography>
                            </Grid>
                            <Grid item xs={7}>
                              <Typography
                                variant="h6"
                                color="textSecondary"
                                component="span"
                              >
                                {data.running}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
        {text && <pre>{text}</pre>}
      </Container>
    </Page>
  );
}
