import '../style.css'


function ConfirmPasswordInputField({
                                       handleValidation,
                                       handlePasswordChange,
                                       confirmPasswordValue,
                                       confirmPasswordError,
                                       showPassword
                                   }) {
    return (
        <div className="form-group my-3">

            <div className={"inputContainer"}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPasswordValue}
                    placeholder="Confirm your password here"
                    onChange={handlePasswordChange}
                    onKeyUp={handleValidation}
                    name="confirmPassword"
                    className={"inputBox"}/>
                <label className="text-danger">{confirmPasswordError}</label>
            </div>
            {/*<input type={showPassword ? "text" : "password"}*/}
            {/*    value={confirmPasswordValue}*/}
            {/*    onChange={handlePasswordChange}*/}
            {/*    onKeyUp={handleValidation}*/}
            {/*    name="confirmPassword"*/}
            {/*    placeholder="Password"*/}
            {/*    className="form-control" />*/}
            {/*<p className="text-danger">{confirmPasswordError}</p>*/}

        </div>
    )
}

export default ConfirmPasswordInputField;