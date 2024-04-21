import React from "react";
import cl from './.module.css';
import { API_PORT, CLIENT_PORT, HOST } from "../../constants";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

export default function UserSettingsPage() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [modalWindowMode, setModalWindowMode] = React.useState(null);

    const usernameInputRef = React.useRef(null);
    const oldPasswordInputRef = React.useRef(null);
    const newPasswordInputRef = React.useRef(null);
    const confirmPasswordInputRef = React.useRef(null);
    const confirmAccountDeletionInputRef = React.useRef(null);

    async function updateUserInfoRequest() {
        const response = await fetch(`${HOST}:${API_PORT}/api/users/info`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInputRef.current.value
            })
        });

        if (response.status === 200) {
            alert("Changes are saved.");
        } else if (response.status === 500) {
            alert("Server error.");
        }
    }

    async function updateUserPasswordRequest() {
        const response = await fetch(`${HOST}:${API_PORT}/api/users/password`, {
            method: "PUT",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oldPassword: oldPasswordInputRef.current.value,
                newPassword: newPasswordInputRef.current.value,
                confirmPassword: confirmPasswordInputRef.current.value
            })
        });
        const json = await response.json();

        if (response.status === 200) {
            alert("Password is changed.");
        } else if (response.status === 500) {
            alert("Server error.");
        } else if (response.status < 500 && response.status >= 400 && json.message) {
            alert(json.message);
        } else {
            alert("Input format error.");
        }
    }

    async function deleteAccountRequest() {
        const response = await fetch(`${HOST}:${API_PORT}/api/users`, {
            method: "DELETE",
            mode: "cors",
            credentials: "include"
        });
        const json = await response.json();

        if (response.status === 200) {
            window.location.replace(`${HOST}:${CLIENT_PORT}/sign-in`);
        } else if (response.status === 500) {
            alert("Server error.");
        } else if (response.status < 500 && response.status >= 400 && json.message) {
            alert(json.message);
        }
    }

    async function loadUserInfo() {
        const response = await fetch(`${HOST}:${API_PORT}/api/users/self`, {
            method: "GET",
            mode: "cors",
            credentials: "include"
        });
        const json = await response.json();

        setUserInfo(json.data || undefined);
    }

    function renderModalWindow() {
        switch (modalWindowMode) {
            case 'change-password':
                return (
                    <div className={`${cl.modal_window__background}`}
                        onClick={() => { setModalWindowMode(null); }}>
                        <div className={`${cl.modal_window}`}
                            onClick={(e) => { e.stopPropagation(); }}>
                            <div className={`${cl.modal_window__content}`}>
                                <h1 className={`${cl.modal_window__header}`}>Change password</h1>
                                <div className={`${cl.modal_window__old_password__cont}`}>
                                    <label className={`${cl.modal_window__old_password__label}`}>Old password</label>
                                    <input className={`${cl.modal_window__old_password__input}`}
                                        type="password"
                                        placeholder="..."
                                        maxLength="480"
                                        ref={oldPasswordInputRef} />
                                </div>
                                <div className={`${cl.modal_window__new_password__cont}`}>
                                    <label className={`${cl.modal_window__new_password__label}`}>New password</label>
                                    <input className={`${cl.modal_window__new_password__input}`}
                                        type="password"
                                        placeholder="..."
                                        maxLength="480"
                                        ref={newPasswordInputRef} />
                                </div>
                                <div className={`${cl.modal_window__confirm_password__cont}`}>
                                    <label className={`${cl.modal_window__confirm_password__label}`}>Confirm password</label>
                                    <input className={`${cl.modal_window__confirm_password__input}`}
                                        type="password"
                                        placeholder="..."
                                        maxLength="480"
                                        ref={confirmPasswordInputRef} />
                                </div>
                            </div>
                            <div className={`${cl.modal_window__control}`}>
                                <div className={`${cl.modal_window__control__buttons}`}>
                                    <button className={`${cl.modal_window__control__buttons__cancel}`}
                                        onClick={() => { setModalWindowMode(null); }}>
                                        Cancel
                                    </button>
                                    <button className={`${cl.modal_window__control__buttons__apply}`}
                                        onClick={updateUserPasswordRequest}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'delete-account':
                return (
                    <div className={`${cl.modal_window__background}`}
                        onClick={() => { setModalWindowMode(null); }}>
                        <div className={`${cl.modal_window}`}
                            onClick={(e) => { e.stopPropagation(); }}>
                            <div className={`${cl.modal_window__content}`}>
                                <h1 className={`${cl.modal_window__header}`}>Delete account</h1>
                                <div className={`${cl.modal_window__confirm_deletion__cont}`}>
                                    <p className={`${cl.modal_window__confirm_deletion__description}`}>
                                        Before deleting this account, you must
                                        to input the username below so we make sure you
                                        really want to do execute the operation.
                                    </p>
                                    <input className={`${cl.modal_window__confirm_deletion__input}`}
                                        type="text"
                                        placeholder="Username"
                                        maxLength="480"
                                        ref={confirmAccountDeletionInputRef} />
                                </div>
                            </div>
                            <div className={`${cl.modal_window__control}`}>
                                <div className={`${cl.modal_window__control__buttons}`}>
                                    <button className={`${cl.modal_window__control__buttons__cancel}`}
                                        onClick={() => { setModalWindowMode(null); }}>
                                        Cancel
                                    </button>
                                    <button className={`${cl.modal_window__control__buttons__apply}`}
                                        onClick={() => {
                                            if (confirmAccountDeletionInputRef.current.value === userInfo.name) {
                                                deleteAccountRequest();
                                            } else {
                                                alert("The operation is not confirmed.");
                                            }
                                        }}>
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    React.useEffect(() => {
        if (userInfo === null) {
            loadUserInfo();
        }
    });

    return (
        <>
            {
                userInfo === null ?
                    <div className={`${cl.main__loading}`}>
                        <LoadingAnimation size="50px" curveWidth="10px" />
                    </div>
                    :
                    <div className={`${cl.main}`}>
                        <div className={`${cl.page_header__cont}`}>
                            <h1 className={`${cl.page_header}`}
                                onClick={() => window.location.href = `${HOST}:${CLIENT_PORT}`}>
                                Event Cartographer
                            </h1>
                            <button className={`${cl.page_header__save_changes_button}`}
                                onClick={updateUserInfoRequest}>
                                Save changes
                            </button>
                        </div><div className={`${cl.page_header__sep_line__cont}`}>
                            <div className={`${cl.page_header__sep_line}`} />
                        </div><div className={`${cl.basic_info}`}>
                            <div className={`${cl.basic_info__header__cont}`}>
                                <h2 className={`${cl.basic_info__header}`}>Basic info</h2>
                            </div>
                            <div className={`${cl.username__cont}`}>
                                <label className={`${cl.username__label}`}>Username</label>
                                <input className={`${cl.username__input}`}
                                    type="text"
                                    placeholder="Username"
                                    maxLength="480"
                                    defaultValue={userInfo.name}
                                    ref={usernameInputRef} />
                            </div>
                        </div><div className={`${cl.normal_sep_line__cont}`}>
                            <div className={`${cl.normal_sep_line}`} />
                        </div><div className={`${cl.important_settings}`}>
                            <div className={`${cl.important_settings__header__cont}`}>
                                <h2 className={`${cl.important_settings__header}`}>Important</h2>
                            </div>
                            <div className={`${cl.important_settings__buttons}`}>
                                <button className={`${cl.change_password__button} ${cl.important_settings__button}`}
                                    onClick={() => { setModalWindowMode('change-password'); }}>
                                    Change password
                                </button>
                                <button className={`${cl.delete_account__button} ${cl.important_settings__button}`}
                                    onClick={() => { setModalWindowMode('delete-account'); }}>
                                    Delete account
                                </button>
                            </div>
                        </div>
                        {renderModalWindow()}
                    </div>
            }
        </>
    );
}