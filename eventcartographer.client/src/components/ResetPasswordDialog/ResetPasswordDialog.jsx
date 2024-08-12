import React from 'react';
import cl from './.module.css';
import PropTypes from "prop-types";
import { API_PORT, HOST } from '../../constants';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';
import { useTranslation } from 'react-i18next';

const ResetPasswordDialog = React.memo(({
    dialogState,
    setDialogState
}) => {
    const { t, i18n } = useTranslation();

    const [theme] = React.useState(localStorage.getItem('theme') ??
        window.matchMedia("(prefers-color-scheme: light)").matches ? 'light' : 'dark');
    const [sendingEmail, setSendingEmail] = React.useState(false);

    const resetPasswordInputRef = React.useRef(null);
    const dialogRef = React.useRef(null);

    async function resetPasswordPermissionRequest() {
        setSendingEmail(true);

        const response = await fetch(`${HOST}:${API_PORT}/api/users/reset-password-permission`, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Language": i18n.language
            },
            body: JSON.stringify({
                username: resetPasswordInputRef.current.value || null
            })
        });
        const json = await response.json();

        if (response.ok) {
            alert(t('sign-in.reset-password-modal-window.email-is-sent'));
            setDialogState(false);
        } else if (!response.ok) {
            if (json.message) {
                alert(t(json.message));
            } else {
                let errors = "";
                for (const prop in json.errors) {
                    for (const err in json.errors[prop]) {
                        errors += `${t(json.errors[prop][err])}\n`;
                    }
                }
                errors = errors.slice(0, -1);
                alert(errors);
            }
        } else if (response.status >= 500 && response.status <= 599) {
            alert(t('general.server-error'));
        }

        setSendingEmail(false);
    }

    React.useEffect(() => {
        if (dialogState) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [dialogState]);

    return (
        <dialog className={`${cl.modal_window} ${cl[theme]}`}
            ref={dialogRef}
            onCancel={() => setDialogState(false)}>
            <div className={`${cl.modal_window__content}`}>
                <h1 className={`${cl.modal_window__header}`}>
                    {t('sign-in.reset-password-modal-window.header')}
                </h1>
                <p className={`${cl.modal_window__reset_password__description}`}>
                    {t('sign-in.reset-password-modal-window.description')}
                </p>
                <input className={`${cl.modal_window__reset_password__input}`}
                    type="text"
                    placeholder={t('sign-in.reset-password-modal-window.username-input')}
                    maxLength="480"
                    ref={resetPasswordInputRef} />
            </div>
            <div className={`${cl.modal_window__control}`}>
                <div className={`${cl.modal_window__control__buttons}`}>
                    <button className={`${cl.modal_window__control__buttons__cancel}`}
                        onClick={() => setDialogState(false)}>
                        {t('sign-in.reset-password-modal-window.cancel')}
                    </button>
                    <button className={`${cl.modal_window__control__buttons__apply}`}
                        onClick={() => {
                            if (!sendingEmail) {
                                resetPasswordPermissionRequest();
                            }
                        }}>
                        {
                            sendingEmail ?
                                <LoadingAnimation
                                    curveColor1="#FFFFFF"
                                    curveColor2="#00000000"
                                    size="15px"
                                    curveWidth="3px" />
                                :
                                <span>
                                    {t('sign-in.reset-password-modal-window.send-mail')}
                                </span>
                        }
                    </button>
                </div>
            </div>
        </dialog>
    );
});

ResetPasswordDialog.displayName = "ResetPasswordDialog";

ResetPasswordDialog.propTypes = {
    dialogState: PropTypes.bool.isRequired,
    setDialogState: PropTypes.func.isRequired
};

export default ResetPasswordDialog;