import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { Link as RRDLink, useHistory } from 'react-router-dom';
import { ThemeContext } from '../../context/useTheme';
import { Fab, Hidden, MenuItem, LinearProgress } from '@material-ui/core';
import { Brightness4, Brightness7 } from '@material-ui/icons'
import { useSnackbar } from 'notistack'

import Axios from 'axios';
import SERVER_URI from '../../config';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1489&q=80)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'right'
  },
  paper: {
    margin: theme.spacing(0, 4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cosmicom: {
    fontFamily: "'Open Sans', sans-serif",
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3)
  },
  forgotLabel: {
    marginTop: theme.spacing(2)
  },
  fab: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    [theme.breakpoints.down('md')]: {
      boxShadow: 'none'
    }
  }
}));

export default function Login() {

  const classes = useStyles();

  const {dark, toggleTheme} = useContext(ThemeContext)

  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  const [details, setDetails] = useState({
    email: '',
    password: '',
    usertype: 'user'
  })

  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const et = e.target
    if (!!et.id)
        setDetails({...details, [et.id]: et.value})
    else
        setDetails({...details, [et.name]: et.value})    
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!details.email || !details.password) {
      alert("Please fill all fields to login")
      return
    }
    setLoading(true)
    Axios.post(
      `${SERVER_URI}/login`,
      details,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(res => {
      enqueueSnackbar('Login Successful', { variant: 'success'})
      sessionStorage.setItem('token', res.data.token)
      history.push(`/${details.usertype}` + (details.usertype === "user" ? '?page=1' : ''))
    })
    .catch(err => {
      console.log(err)
      enqueueSnackbar('Invalid credentials', {
        variant: 'error'
      })
      setLoading(false)
    })
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={8} className={classes.image}>
        <Hidden smDown>
        <Typography 
          component="h1" 
          variant="h2" 
          className={classes.cosmicom} 
          style={{
            backgroundColor: dark ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"
          }}
        >
          Cosmicom
        </Typography>
        </Hidden>
      </Grid>
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="usertype"
                label="How do you plan to use this website?"
                name="usertype"
                autoComplete="usertype"
                select
                value={details.usertype}
                onChange={handleChange}
              >
                  <MenuItem value="user">As a customer</MenuItem>
                  <MenuItem value="merchant">As a merchant</MenuItem>
                  <MenuItem value="shipper">As a shipper</MenuItem>
                  <MenuItem value="employee">As an employee</MenuItem>
              </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            {loading && <LinearProgress />}
            <Grid container className={classes.forgotLabel}>
              <Grid item>
                <Link component={RRDLink} to='/register'>
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
        <Fab color="secondary" aria-label="toggle" onClick={toggleTheme} className={classes.fab}>
            {dark ? <Brightness7/> : <Brightness4/>}
        </Fab>
    </Grid>
  );
}