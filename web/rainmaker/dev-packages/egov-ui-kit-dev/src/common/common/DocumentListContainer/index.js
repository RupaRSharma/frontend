import { withStyles } from "@material-ui/core/styles";
import { getPurpose } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import DocumentList from "../DocumentList";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});

class DocumentListContainer extends Component {
  render() {
    const { ...rest } = this.props;
    return <DocumentList {...rest} />;
  }
}
const filterDropdownFunction = (rowObject, preparedFinalObject, filterConditon) => {
  if (!filterConditon) {
    return true;
  } else {
    if (filterConditon.parentArrayJsonPath) {
      let returnValue = false;
      const objectArray = get(preparedFinalObject, filterConditon.parentArrayJsonPath, []);
      objectArray.map(object => {
        if (rowObject.parentValue.includes(get(object, filterConditon.parentJsonpath, null))) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.parentJsonpath, null);
    if (rowObject.parentValue.includes(objectValue)) {
      return true;
    } else {
      return false;
    }
  }
}
const filterFunction = (rowObject, preparedFinalObject, filterConditon) => {
  if (!filterConditon) {
    return true;
  } else {
    if (filterConditon.onArray) {
      let returnValue = false;
      const objectArray = get(preparedFinalObject, filterConditon.jsonPath, []);
      objectArray.map(object => {
        if (!filterConditon.filterValue.includes(get(object, filterConditon.arrayAttribute, null))) {
          returnValue = true;
        }
      })
      return returnValue;
    }
    const objectValue = get(preparedFinalObject, filterConditon.jsonPath, null);
    if (!filterConditon.filterValue.includes(objectValue)) {
      return true;
    } else {
      return false;
    }
  }
}
const mapStateToProps = state => {
  let preparedFinalObject = get(state, 'common.prepareFormData', {})
  let ptDocumentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContract",
    []
  );
  ptDocumentsList.map(documentList => {
    documentList.cards.map(document => {
      if (document.code.includes("TRANSFERREASONDOCUMENT")) {
        document.dropdown.value = reasonForTransfer;
        document.dropdown.disabled = true;
      }
      if (document.enabledActions) {
        const purpose = getPurpose();
        document.disabled = document.enabledActions[purpose].disableUpload ? true : false;
        document.dropdown.disabled = document.enabledActions[purpose].disableDropdown ? true : false;
      }

      document.dropdown.menu = document.dropdown.menu.filter(menu => filterDropdownFunction(menu, preparedFinalObject, document.dropdownFilter));
      if (document.dropdown.menu.length == 1) {
        document.dropdown.value = get(document, 'dropdown.menu[0].code', '');
      }
    })
    documentList.cards = documentList.cards.filter(document => filterFunction(document, preparedFinalObject, document.filterCondition))
  })
  return { ptDocumentsList, preparedFinalObject };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainer)
);