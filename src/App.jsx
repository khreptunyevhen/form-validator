import './app.scss';
// import { useState } from 'react';
import { useImmer } from 'use-immer';
import * as EmailValidator from 'email-validator';
import { passwordStrength } from 'check-password-strength';

const initialState = {
  email:'',
  password: '',
  confirmPassword: '',
  showPassword: false,
  showInvalidemail: false,
  isPasswordShort: false,
  passwordMatch: false,
  passwordStrength: {
    color: '',
    value: '',
  }
}

function App() {

  const [state, setState] = useImmer(initialState);

  
  const validate = (
    state.email && 
    !state.showInvalidemail && 
    state.password.length > 8 &&
    ['Medium','Strong'].includes(state.passwordStrength.value) &&
    state.password === state.confirmPassword)

  return (

    <div id="app">
    <form id="my-form" className="shadow">
      <h4>Form Validator</h4>

      <div className="mb-4">
        <label>Email</label>
        <input 
            className="form-control" 
            type="text" 
            data-rules="required|digits:5|min:5"
            placeholder='Please put email'
            value={state.email || ''}
            onChange={event => {
              setState( draft => {
                draft.email = event.target.value
              })
            }}

            onBlur={() => {
              setState(draft => {
                draft.showInvalidemail = !EmailValidator.validate(state?.email);
              })
            }}
        />
        {
          state.showInvalidemail && 
          <p className='validator-err'>Email is not valid, Please make sure you input correct email</p>
        }
      </div>
      <div 
          className="mb-4"
          style={{
            position: 'relative'
          }}
          >
        <label>Password</label>
        <input 
            className="form-control" 
            // type="password" 
            type={state.showPassword ? 'text' : 'password'}
            data-rules="required|string|min:5"
            value={state.password || ''}
            onChange={event => {
              // setState({
              //   ...state,
              //   password: event.target.value
              // })
              setState(draft => {
                draft.password = event.target.value;
                if(state.showPassword) {
                  draft.confirmPassword = event.target.value;
                }
                if(event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(event.target.value).value;
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch(passwordStrengthValue) {
                      case 'Too weak':
                        draft.passwordStrength.color = 'red';
                        break;
                      case 'Weak':
                        draft.passwordStrength.color = 'orange';
                        break;   
                      case 'Medium':
                        draft.passwordStrength.color = 'blue';
                        break;                                   
                      default:
                        draft.passwordStrength.color = 'green';
                  }
                  // draft.isPasswordShort = true;
                } else {
                  draft.passwordStrength.value = '';
                  draft.passwordStrength.color = '';
                }
              })
            }}            

            onBlur={() => {
              setState(draft => {
                draft.isPasswordShort = state.password.length < 9;
              })
            }}
        />
        {
          state.isPasswordShort && 
          <p className='validator-err'>Password must be more than 8 character</p>
        }
        <button
            style={{
              position: 'absolute',
              top: 25,
              right: 10,
              width: 50,
              padding: '0px 1 important',
              margin:0,
              fontSize:2,
              border: 'none! important'
            }}
            type='button'
            onClick={() => {
              setState(draft => {
                draft.showPassword = !state.showPassword;
                if(!state.showPassword) {
                  draft.confirmPassword = state.password;
                  draft.passwordMatch = true;
                } else {
                  draft.passwordMatch = false;
                  draft.confirmPassword = '';
                }
                })
            }}
  
        >eye</button>
      </div>
      {
        // !state.showPassword && 
        true && 
        <div className="mb-4">
        <label>Password Confirm</label>
            <input 
                className="form-control" 
                type="password" 
                data-rules="required|string|min:5"
                value={state.confirmPassword || ''}
                onChange={event => {
                  // setState({
                  //   ...state,
                  //   confirmPassword: event.target.value
                  // })
                  setState(draft => {
                    draft.confirmPassword = event.target.value;
                    draft.passwordMatch = event.target.value === state.password;
                  })
                }}              
            />            
        </div>
      }
      {
        !state.passwordMatch 
        && state.confirmPassword
        && <p className='validator-err'>Confirm password does not match with original password</p>
      }

      {
          state.passwordStrength.value && 
          <div 
            className="mb-4"
            style={{
              position: 'relative',
              color: state.passwordStrength.color
            }}
            >
              {state.passwordStrength.value}      
        </div>              
      }

      <button
          disabled={!validate}
          style={{        
            backgroundColor: validate? '':'gray'
          }}   
          onClick={() => {
            alert('Congratulation! The form validation is finished');
            setState(draft => {
              setState(initialState);
            })
          }}   
          type = 'button'
          >Create Email</button>
    </form>
  </div>
  );
}

export default App;
