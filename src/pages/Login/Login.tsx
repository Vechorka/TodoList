import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {AppRootState, useAppDispatch} from "../../app/store";
import {loginTC} from "./auth-reducer";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch()

    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.auth.isLoggedIn)

    const formik = useFormik({
        validate: (values) => {
            if (!values.email){
                return {
                    email: 'Email is required'
                }
            }
            if (!values.password){
                return {
                    password: 'Password is required'
                }
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: async(values, formikHelpers: FormikHelpers<FormValuesType>) => {
           const action = await dispatch(loginTC(values))
            if (loginTC.rejected.match(action)){
                if(action.payload?.fieldsErrors?.length){
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
                else {

                }
            }
        },
    });

    if (isLoggedIn){
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <FormGroup>
                    <TextField label="Email" margin="normal"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}

                    <TextField type="password" label="Password" margin="normal"
                               {...formik.getFieldProps('password')}
                    />
                    {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}

                    <FormControlLabel label={'Remember me'}
                                      control={<Checkbox
                                          {...formik.getFieldProps('rememberMe')}
                                          checked={formik.values.rememberMe}/>}
                    />
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
            </FormControl>
            </form>
        </Grid>
    </Grid>
}

