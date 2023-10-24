                  <button
                                disabled={!btn}
                                className={!btn ? "disabled-button disableForEdit" : "resetmaskBtn1"}
                                // className="resetmaskBtn1"
                                onClick={() => {
                                    // submit2();
                                    selectModel()
                                    setbtn(false)
                                    navigate('/trymodalpage')
                                }}
                            >
                                  {!btn ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>

                                        Virtual try on
                             
                                    </>
                                )}
                            </button>


.loader {
    border: 5px solid #f3f3f3;
    /* Light gray */
    border-top: 5px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}


.disabled-button {
    display: flex;
    align-items: center;
    /* Vertically center the content */
    justify-content: center;
    /* Horizontally center the content */
    background-color: #e0e0e0 !important;
    /* Grey background */
    color: #a0a0a0;
    /* Grey text */
    cursor: not-allowed;
    /* Show a "not-allowed" cursor on hover */
    border: 1px solid #d0d0d0;
    /* Grey border */
    height: 45px;

    border-radius: 8px;
    border: none;
    /* margin-top: 25px; */
    color: var(--neutrals-white, #fff);
    font-size: 14px;
    font-family: Inter;
    font-weight: 600;
    line-height: 110%;
    transition: transform 0.3s ease !important;
    box-shadow: 0.2778vw 0.2778vw 0.2778vw 0px rgba(0, 0, 0, 0.25);
    letter-spacing: 1px;
    background-color: #ababab !important
}
