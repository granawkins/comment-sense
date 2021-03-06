import { useState, useEffect, useRef } from 'react'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'

import { postData } from '../utils/helpers'
import LoadingCircle from '../utils/LoadingCircle'

const styles = (theme) => ({
    ...theme.typography,
    error: {
        color: theme.palette.csRed.main,
    },
    csRed: {
        color: 'white',
        backgroundColor: theme.palette.csRed.main,
    }
})

// Check if string is valid email address. ref: https://stackoverflow.com/a/46181
const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

const Waitlist = ({isOpen, setIsOpen, classes}) => {

    // What to do with a valid address
    const [submitted, setSubmitted] = useState(false)
    const [successful, setSuccessful] = useState(false)
    const [hasError, setHasError] = useState(false)
    const submit = async () => {
        setSubmitted(true)
        const response = await postData('/api/add_waitlist', {email: emailRef.current})
        if (!response.error) {
            setSuccessful(true)
        } else {
            setHasError(true)
        }
        window.setTimeout(() => {
            setIsOpen(false)
        }, 1000)
    }

    // Handle button clicks
    const [invalid, setInvalid] = useState(false)
    const handleActionSubmit = () => {
        if (!validateEmail(emailRef.current)) {
            setInvalid(true)
        } else {
            submit()
        }
    }
    const handleActionClose = () => {
        setIsOpen(false)
    }

    // Update email variable while you type
    // useState to manage input field, useRef for listener (https://stackoverflow.com/a/55265764)
    const [email, setEmail] = useState("")
    const emailRef = useRef(email)
    const handleEmail = (e) => {
        setEmail(e.target.value)
        emailRef.current = e.target.value
        // Turn off the error message after they've updated it
        if (invalid) {
            setInvalid(false)
        }
    }

    // Pressing enter clicks 'submit'
    const listenEnter = (e) => {
        if (e.key === 'Enter') {
            handleActionSubmit()
        }
    }
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', listenEnter)
        } else {
            window.removeEventListener('keydown', listenEnter)
        }
    }, [isOpen])

    const [placeholder, setPlaceholder] = useState(null)
    useEffect(() => {
        if (submitted && !successful && !hasError) {
            setPlaceholder(<LoadingCircle />)
        } else if (successful) {
            setPlaceholder(
                <Typography className={classes.body1}>
                    Success! We'll be in touch.
                </Typography>
            )
        } else if (hasError) {
            setPlaceholder(
                <Typography className={classes.body1}>
                    Error. Please try again later.
                </Typography>
            )
        } else {
            setPlaceholder(null)
        }
    }, [submitted, successful, hasError])

    return (
        <Dialog open={isOpen} onClose={handleActionClose}>
            <DialogTitle id="form-dialog-title">
                <Typography className={classes.h5}>Join Waitlist</Typography>
            </DialogTitle>
            <DialogContent>
                {placeholder
                    ? placeholder
                    : <TextField
                        error={invalid ? true : false}
                        helperText={invalid ? "Enter a valid email address" : ""}
                        autoFocus
                        placeholder="Enter email address"
                        margin="none"
                        type="email"
                        onChange={handleEmail}
                        value={email}
                    />
                }
            </DialogContent>
            <DialogActions>
                {placeholder
                    ? null
                    : <>
                        <Button onClick={handleActionClose} variant="contained" color="primary">
                            CANCEL
                        </Button>
                        <Button type="submit" onClick={handleActionSubmit} variant="contained"
                                className={classes.csRed}>
                            SUBMIT
                        </Button>
                    </>
                }
            </DialogActions>
        </Dialog>
    )

}

export default withStyles(styles)(Waitlist)
