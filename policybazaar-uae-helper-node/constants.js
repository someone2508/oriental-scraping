const INSURERS = {
    ORIENTAL: 10
}

module.exports = {
    BASE_ENDPOINT: '/helper',
    INSURERS,
    SCRAPPING: {
        [INSURERS.ORIENTAL]: {
            EMAIL: 'credential10@genesisinsuranceuae.com',
            PASSWORD: 'Oriental@10',
            BASE_URL: 'https://portal.oicgulf.ae',
            LOGIN_URL: '/auth/login',
            POLICY_FORM_URL: '/addpolicy',
            SELECTORS: {
                LOGIN_FORM: '#kt_login_signin_form',
                LOGIN_EMAIL_FIELD: '[name="email"]',
                LOGIN_PASSWORD_FIELD: '[name="password"]',
                LOGIN_SUBMIT_BUTTON: '#kt_login_signin_submit',
                HOME_PAGE_MODAL: '.modal-footer button.btn-primary',
                POLICY_TYPE_SELECT: 'select[name="policytype"]',
                VEHICLE_MAKE_SELECT: 'select[name="VehicleMake"]',
                VEHICLE_MODEL_SELECT: 'select[name="makeModel"]',
                VEHICLE_MODEL_YEAR_SELECT: 'select[name="ModelYear"]',
                VEHICLE_SUM_ASSURED_FIELD: '[name="suminsured"]',
                INSURED_NAME_FIELD: '[name="insuredname"]',
                DOB_SELECTOR: '[name="dob"]',
                DL_ISSUE_DATE_SELECTOR: '[name="dobd"]',
                NATIONALITY_SELECT: '[name="Nationality"]',
                LOCATION_SELECT: '[name="location"]',
                VEHICLE_TYPE_SELECT: '[name="vehicleType"]',
                FIRST_REG_DATE_SELECTOR: '[name="firstRegDatess"]',
                NO_CLAIM_SELECT: '[name="ClaimsFreeDrivingYears"]'
            },
            PREMIUM_SECTION_ELEMENTS: ["basicPremium", "includedAddons", "optionalAddons", "evg", "breakup"]
        },
    }
}