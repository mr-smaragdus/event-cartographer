import React from 'react';
import cl from './.module.css';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { API_PORT, HOST } from '../../constants';

const PasswordUserSettings = React.memo(() => {
    const [updatingPassword, setUpdatingPassword] = React.useState(false);

    const oldPasswordInputRef = React.useRef(null);
    const newPasswordInputRef = React.useRef(null);
    const confirmPasswordInputRef = React.useRef(null);

    async function updateUserPasswordRequest() {
        setUpdatingPassword(true);

        const response = await fetch(`${HOST}:${API_PORT}/api/users/password`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: oldPasswordInputRef.current.value || null,
                newPassword: newPasswordInputRef.current.value || null,
                confirmPassword: confirmPasswordInputRef.current.value || null
            })
        });
        const json = await response.json();

        if (response.ok) {
            alert("Password is changed.");
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

        setUpdatingPassword(false);
    }

    return (
        <div className={cl.panel__other_settings__element}>
            <div className={`${cl.panel__other_settings__element__content}`}>
                <h3 className={`${cl.panel__other_settings__element__header}`}>
                    Change password
                </h3>
                <input className={`${cl.panel__other_settings__element__input}`}
                    type="password"
                    placeholder="Old password"
                    maxLength="200"
                    ref={oldPasswordInputRef} />
                <input className={`${cl.panel__other_settings__element__input}`}
                    type="password"
                    placeholder="New password"
                    maxLength="200"
                    ref={newPasswordInputRef} />
                <input className={`${cl.panel__other_settings__element__input}`}
                    type="password"
                    placeholder="Confirm new password"
                    maxLength="200"
                    ref={confirmPasswordInputRef} />
            </div>
            <div className={`${cl.panel__other_settings__element__control}`}>
                <button className={`${cl.panel__other_settings__element__control__apply}`}
                    onClick={() => {
                        if (!updatingPassword) {
                            updateUserPasswordRequest();
                        }
                    }}>
                    {
                        updatingPassword ?
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

PasswordUserSettings.displayName = 'PasswordUserSettings';

export default PasswordUserSettings;
