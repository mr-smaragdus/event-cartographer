import React from 'react';
import cl from './.module.css';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { API_PORT, HOST } from '../../constants';

const EmailAddressUserSettings = React.memo(() => {
    const [updatingEmail, setUpdatingEmail] = React.useState(false);

    const passwordInputRef = React.useRef(null);
    const newEmailInputRef = React.useRef(null);

    async function updateUserEmailRequest() {
        setUpdatingEmail(true);

        const response = await fetch(`${HOST}:${API_PORT}/api/users/email`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: passwordInputRef.current.value || null,
                email: newEmailInputRef.current.value || null
            })
        });
        const json = await response.json();

        if (response.ok) {
            alert("Email is sent.");
        } else if (!response.ok) {
            if (json.message) {
                alert(json.message);
            } else {
                let errors = "";
                for (const prop in json.errors) {
                    for (const err in json.errors[prop]) {
                        errors += `${json.errors[prop][err]}\n`;
                    }
                }
                errors = errors.slice(0, -1);
                alert(errors);
            }
        } else if (response.status >= 500 && response.status <= 599) {
            alert("Server error.");
        }

        setUpdatingEmail(false);
    }

    return (
        <div className={cl.panel__other_settings__element}>
            <div className={`${cl.panel__other_settings__element__content}`}>
                <h3 className={`${cl.panel__other_settings__element__header}`}>
                    Change email
                </h3>
                <p className={`${cl.panel__other_settings__element__description}`}>
                    Input your password and a new email.
                    After that you will receive a mail in your new
                    email address to confirm it.
                </p>
                <input className={`${cl.panel__other_settings__element__input}`}
                    type="password"
                    placeholder="Password"
                    maxLength="200"
                    ref={passwordInputRef} />
                <input className={`${cl.panel__other_settings__element__input}`}
                    type="email"
                    placeholder="New email address"
                    maxLength="320"
                    ref={newEmailInputRef} />
            </div>
            <div className={`${cl.panel__other_settings__element__control}`}>
                <button className={`${cl.panel__other_settings__element__control__apply}`}
                    onClick={() => {
                        if (!updatingEmail) {
                            updateUserEmailRequest();
                        }
                    }}>
                    {
                        updatingEmail ?
                            <LoadingAnimation
                                curveColor1="#FFFFFF"
                                curveColor2="#00000000"
                                size="15px"
                                curveWidth="3px" />
                            :
                            <span>Apply</span>
                    }
                </button>
            </div>
        </div>
    );
});

EmailAddressUserSettings.displayName = 'EmailAddressUserSettings';

export default EmailAddressUserSettings;