import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
    TextfieldWithIcon
} from "egov-ui-framework/ui-molecules"
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextField from "material-ui/TextField";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';

class DigitalSignatureDialog extends Component {
  state = {
    comments : '',
    password : '',
  }

  setPassword = (e) => {
      this.setState({
        password : e.target.value
      })
  }

  getTokenList = () => {
    const authToken = getAccessToken();
    let RequestInfo = {
      apiId: "Rainmaker",
      ver: ".01",
      // ts: getDateInEpoch(),
      action: "_search",
      did: "1",
      key: "",
      msgId: `20170310130900|${getLocale()}`,
      requesterId: "",
      authToken
    };
  
    RequestInfo = { ...RequestInfo };
    let body =  Object.assign(
      {},
      {
        RequestInfo
      },
      {
        "encryptedRequest": "R1",
        "encryptionKeyId": "R2"
      }
    
    );

    axios.post("/DSC/ListToken", body, {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => {
        console.log(response,"ndjhhhhhhhhhhhhhhhhhh")
      })
      .catch(error => {
        console.log(error.response)
      });
  
  }

  componentDidMount = () => {
    this.getTokenList()
  }

  render() {
    let { closeDigitalSignatureDialog,openDigitalSignaturePopup,okText,resetText,title} = this.props;
   
    return (
      <Dialog
      fullScreen={false}
      open={openDigitalSignaturePopup}
      onClose={closeDigitalSignatureDialog}
      maxWidth={false}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid
                container="true"
                spacing={12}
                marginTop={16}
                className="action-container">
                <Grid
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                  item
                  sm={10}>
                  <Typography component="h2" variant="subheading">
                    <LabelContainer labelName={title}
                    labelKey={title} />
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={2}
                  style={{
                    textAlign: "right",
                    cursor: "pointer",
                    position: "absolute",
                    right: "16px",
                    top: "16px"
                  }}
                  onClick={closeDigitalSignatureDialog}
                >
                  <CloseIcon />
                </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                      />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_CERTIFICATE_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                      />
                  </Grid>
                  <Grid item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                  <LabelContainer style={{
                      fontSize: '11px',
                      fontWeight: 500
                  }}
                  labelName={"CORE_COMMON_PASSWORD_LABEL"}
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} />
                  </Grid>
                  <form style={{width:"100%"}} autocomplete="off">
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                    <TextfieldWithIcon
                        type ="password"
                        style={{ marginRight: "15px" }}
                        pattern = "^([a-zA-Z0-9!])+$"
                        onChange ={ this.setPassword}
                        hasLocalization={false}
                        value = {this.state.password}
                      />
                  </Grid>
                  </form>
                <Grid item sm={12}
                 style={{
                  marginTop: 8,
                  textAlign: "right"
                }}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.resetMessage}
                    style={{
                      marginRight:'4px'
                    }}
                    >
                    <LabelContainer
                      labelName={resetText}
                      labelKey=
                      {resetText}     
                    />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                    //   onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={okText}
                        labelKey=
                          {okText}     
                      />
                    </Button>
                </Grid>
              </Grid>
            }
            
          />
        }
      />
    </Dialog>
    ) 
  }
}

const mapStateToProps = (state) => {
  const { form } = state;
  return { form };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigitalSignatureDialog);
