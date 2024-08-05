import React from 'react';
import cl from './.module.css';
import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';
import { API_PORT, HOST } from '../../constants';
import { useTranslation } from 'react-i18next';

const BasicUserInfoSettings = React.memo(() => {
    const { t } = useTranslation();

    const [savingChangesForUserInfo, setSavingChangesForUserInfo] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState(null);

    const usernameInputRef = React.useRef(null);

    async function loadUserInfo() {
        const response = await fetch(`${HOST}:${API_PORT}/api/users/self`, {
            method: "GET",
            mode: "cors",
            credentials: "include"
        });
        const json = await response.json();

        setUserInfo(json.data || undefined);
    }

    async function updateUserInfoRequest() {
        setSavingChangesForUserInfo(true);

        const response = await fetch(`${HOST}:${API_PORT}/api/users/info`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInputRef.current.value || null
            })
        });
        const json = await response.json();

        if (response.ok) {
            alert(t('settings.basic-info.changes-are-saved'));
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
            alert(t('general.server-error'));
        }

        setSavingChangesForUserInfo(false);
    }

    React.useEffect(() => {
        loadUserInfo();
    }, []);

    if (userInfo === null) {
        return (
            <div className={cl.content_loading}>
                <LoadingAnimation
                    size="50px"
                    curveWidth="10px" />
            </div>
        );
    }

    return (
        <div className={`${cl.panel__basic_info}`}>
            <div className={`${cl.panel__basic_info__header__cont}`}>
                <h2 className={`${cl.panel__basic_info__header}`}>
                    {t('settings.basic-info.header')}
                </h2>
            </div>
            <div className={cl.data_input}>
                <label className={cl.data_input__label}>
                    {t('settings.basic-info.username-input')}
                </label>
                <input className={cl.data_input__input}
                    type="text"
                    placeholder={t('settings.basic-info.username-input')}
                    maxLength="100"
                    defaultValue={userInfo.name}
                    ref={usernameInputRef} />
            </div>
            <button className={cl.save_changes_button}
                onClick={() => {
                    if (!savingChangesForUserInfo) {
                        updateUserInfoRequest();
                    }
                }}>
                {
                    savingChangesForUserInfo ?
                        <LoadingAnimation
                            curveColor1="#FFFFFF"
                            curveColor2="#00000000"
                            size="15px"
                            curveWidth="3px" />
                        :
                        <span>
                            {t('settings.basic-info.save-changes')}
                        </span>
                }
            </button>
        </div>
    );
});

BasicUserInfoSettings.displayName = 'BasicUserInfoSettings';

export default BasicUserInfoSettings;
