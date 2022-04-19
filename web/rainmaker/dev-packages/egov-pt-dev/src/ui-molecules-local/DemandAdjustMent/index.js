import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Label from "../../ui-containers-local/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
// import get from "lodash/get";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import TextFieldContainer from "egov-ui-framework/ui-containers/TextFieldContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import store from "ui-redux/store";
import { prepareFinalObject, showSpinner, hideSpinner, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
// import { updateDemand } from "../../ui-utils/commons"
import { Button } from "egov-ui-framework/ui-atoms";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from '../../ui-utils/api'
import { searchApiCall } from "../../ui-config/screens/specs/pt-mutation/demand-adjust-ViewList"
const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  },
  editStyle: {
    color: 'white',
    float: 'right',
    backgroundColor: "#DB6844",

  }
};
export const updateDemand = async (queryObject) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let connectionNumber = getQueryArg(window.location.href, "propertyId");

  const response = await httpRequest(
    "post",
    "/pt-calculator-v2/demand/_modify",
    "_modify",
    [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "PT" }],
    { Demands: queryObject }
  );
  return response;


}
export const sumTaxHeads = (demandDetails) => {
  // console.log(demandDetails, "Nero demandDetails")
  let holder = {}
  let demandDetailsArray = [];
  // total tax amount cannot be less than collected amount
  let collectionHolder = {}
  demandDetails.forEach(function (d) {

    if (holder.hasOwnProperty(d.taxHeadMasterCode)) {
      holder[d.taxHeadMasterCode] = holder[d.taxHeadMasterCode] + d.taxAmount;
    } else {
      holder[d.taxHeadMasterCode] = d.taxAmount;

    }
  });
  demandDetails.forEach(function (e) {

    if (collectionHolder.hasOwnProperty(e.taxHeadMasterCode)) {
      collectionHolder[e.taxHeadMasterCode] = collectionHolder[e.taxHeadMasterCode] + e.collectionAmount;

    } else {
      collectionHolder[e.taxHeadMasterCode] = e.collectionAmount;

    }
  });

  for (var prop in holder) {
    let totTaxAmount
    let collectedAmount
    for (var key in collectionHolder) {
      if (prop == key) {
        collectedAmount = collectionHolder[key]
        totTaxAmount = holder[prop] - collectionHolder[key]
      }
    }
    demandDetailsArray.push({ taxHeadMasterCode: prop, taxAmount: totTaxAmount, collectionAmount: collectedAmount });
  }


  return demandDetailsArray;
}

class DemandAdjust extends React.Component {

  state = {

    isEditVisible: false,
    holdingtax: 0,
    lightTax: 0,
    waterTax: 0,
    DrainageTax: 0,
    LatrineTax: 0,
    ParkingTax: 0,
    SolidWasteUserCharges: 0,
    interest: 0,
    otherDues: 0,
    serviceTax: 0,
    ownershipExemption: 0,
    UsageExemption: 0,
    penalty: 0,
    rebate: 0,

    totalHoldingtax: 0,
    TotalLightTax: 0,
    totalWaterTax: 0,
    totalDrainageTax: 0,
    totalLatrineTax: 0,
    totalParkingTax: 0,
    totalSolidWasteUserCharges: 0,
    totalInterest: 0,
    totalOtherDues: 0,
    totalServiceTax: 0,
    totalOwnershipExemption: 0,
    totalUsageExemption: 0,
    totalPenalty: 0,
    totalRebate: 0,
    holdingObj: "",
    lightTaxObj: "",
    waterTaxObj: "",
    serviceTaxObj: "",
    otherDuesObj: "",
    interestObj: "",
    SolidWasteUserChargesObj: "",
    ParkingTaxObj: "",
    LatrineTaxObj: "",
    DrainageTaxObj: "",
    ownershipExemptionObj: "",
    UsageExemptionObj: "",
    penaltyObj: "",
    rebateObj: "",
    errorOwnershipExemption: "",
    errorUsageExemption: "",
    editYearWise: 0,
    clickCount :0
  }

  handleChange = (e) => {
    // console.log(e.target.value, e.target.name, "e.target.value",)
    if (e.target.name == "holdingtax") {
      this.setState({ holdingObj: "PT_HOLDING_TAX" })
    }
    if (e.target.name == "lightTax") {
      this.setState({ lightTaxObj: "PT_LIGHT_TAX" })
    }
    if (e.target.name == "waterTax") {
      this.setState({ waterTaxObj: "PT_WATER_TAX" })
    }
    if (e.target.name == "DrainageTax") {
      this.setState({ DrainageTaxObj: "PT_DRAINAGE_TAX" })
    }
    if (e.target.name == "LatrineTax") {
      this.setState({ LatrineTaxObj: "PT_LATRINE_TAX" })
    }
    if (e.target.name == "ParkingTax") {
      this.setState({ ParkingTaxObj: "PT_PARKING_TAX" })
    }
    if (e.target.name == "SolidWasteUserCharges") {
      this.setState({ SolidWasteUserChargesObj: "PT_SOLID_WASTE_USER_CHARGES" })
    }

    if (e.target.name == "interest") {
      this.setState({ interestObj: "PT_INTEREST" })
    }
    if (e.target.name == "otherDues") {
      this.setState({ otherDuesObj: "PT_OTHER_DUES" })
    }
    if (e.target.name == "serviceTax") {
      this.setState({ serviceTaxObj: "PT_SERVICE_TAX" })
    }
    if (e.target.name == "ownershipExemption") {
      this.setState({ ownershipExemptionObj: "PT_OWNERSHIP_EXCEMPTION" })
    }
    if (e.target.name == "UsageExemption") {
      this.setState({ UsageExemptionObj: "PT_USAGE_EXCEMPTION" })
    }
    if (e.target.name == "penalty") {
      this.setState({ penaltyObj: "PT_PENALTY" })
    }
    if (e.target.name == "rebate") {
      this.setState({ rebateObj: "PT_REBATE" })
    }

    this.setState({
      [e.target.name]: e.target.value
    }, () => this.checkvalidation())

  }

  checkvalidation = () => {
    let error = true
    if (this.state.ownershipExemption != "") {
      if (parseInt(this.state.ownershipExemption) > 0) {
        error = false
        this.setState({ errorOwnershipExemption: "Number should be Negative and 0." })
      }
      else if (parseInt(this.state.ownershipExemption) == 0) {
        error = true
        this.setState({ errorOwnershipExemption: "" })
      }
      else {
        error = true
        this.setState({ errorOwnershipExemption: "" })
      }
    }

    if (this.state.UsageExemption != "") {
      if (parseInt(this.state.UsageExemption) > 0) {
        error = false
        this.setState({ errorUsageExemption: "Number should be Negative and 0." })
      }
      else if (parseInt(this.state.UsageExemption) == 0) {
        error = true
        this.setState({ errorUsageExemption: "" })
      }
      else {
        error = true
        this.setState({ errorUsageExemption: "" })
      }
    }
    

    return error;
  }
  onUpdateButtonCLick = async (index) => {
    // console.log("apiplace........", index)
    let consumerCode = getQueryArg(window.location.href, "propertyId");
    const tenantId = getQueryArg(window.location.href, "tenantId")
    let newTaxHead = {
      "id": null,
      "collectionAmount": 0.00,
      "additionalDetails": null,
      "auditDetails": null
    }
    // console.log(e.target, buttonLable, "Nero Event")
    let state = store.getState();
    let { screenConfiguration } = state;

    let { preparedFinalObject } = screenConfiguration;


    // store.dispatch(showSpinner())
    let demands = [preparedFinalObject && preparedFinalObject.Demands[index]];
  

    let editableDemandDetail = demands && demands[0].demandDetails;
    editableDemandDetail = editableDemandDetail && editableDemandDetail.filter(item => item.taxHeadMasterCode == this.state.holdingObj)
    let editableDemandDetailLight = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.lightTaxObj)
    let editableDemandDetailWater = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.waterTaxObj)
    let editableDemandDetailLatrineTax = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.LatrineTaxObj)
    let editableDemandDetailDrainageTax = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.DrainageTaxObj)
    let editableDemandDetailParkingTax = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.ParkingTaxObj)
    let editableDemandDetailSolidWasteUserCharges = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.SolidWasteUserChargesObj)
    let editableDemandDetailotherDues = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.otherDuesObj)
    let editableDemandDetailinterest = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.interestObj)
    let editableDemandDetailserviceTax = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.serviceTaxObj)
    let editableDemandDetailUsageExemption = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.UsageExemptionObj)
    let editableDemandDetailOwnershipExemption = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.ownershipExemptionObj)
    let editableDemandDetailRebate = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.rebateObj)
    let editableDemandDetailPenalty = demands && demands[0].demandDetails.filter(item => item.taxHeadMasterCode == this.state.penaltyObj)
 
    if (editableDemandDetail && editableDemandDetail.length > 0 && editableDemandDetail[0].taxHeadMasterCode == this.state.holdingObj) {
      const datatotal = this.state.holdingtax > this.state.totalHoldingtax ? this.state.holdingtax - this.state.totalHoldingtax : this.state.holdingtax == this.state.totalHoldingtax ? 0.00 : this.state.holdingtax - this.state.totalHoldingtax;
       newTaxHead.taxAmount = parseInt(datatotal)
        newTaxHead.taxHeadMasterCode = "PT_HOLDING_TAX"
        newTaxHead.demandId = editableDemandDetail[0].demandId
      if(this.state.clickCount > 0){
        const filterDatasignleHolding = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode =="PT_HOLDING_TAX")
        if(filterDatasignleHolding.length==0){
          demands[0].demandDetails.push(newTaxHead);
        }else if(filterDatasignleHolding.length>0){
          filterDatasignleHolding[0].taxAmount = parseInt(datatotal)
        }
      }
      else{
        demands[0].demandDetails.push(newTaxHead);
      }
    

   
    }

    if (editableDemandDetailLight && editableDemandDetailLight.length > 0 && editableDemandDetailLight[0].taxHeadMasterCode == this.state.lightTaxObj) {

      const dataTotalLight = this.state.lightTax > this.state.TotalLightTax ? this.state.lightTax - this.state.TotalLightTax : this.state.lightTax == this.state.TotalLightTax ? 0.00 : this.state.lightTax - this.state.TotalLightTax;

    let newObj = {
      "id": null,
      "demandId": editableDemandDetailLight[0].demandId,
      "taxHeadMasterCode": editableDemandDetailLight[0].taxHeadMasterCode,
      "taxAmount": parseInt(dataTotalLight),
      "collectionAmount": 0.00,
      "additionalDetails": null,
      "auditDetails": null,
      "tenantId": editableDemandDetailLight[0].tenantId
    }
    if(this.state.clickCount > 0){
      const filterDatasignle = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode =="PT_LIGHT_TAX")
      if(filterDatasignle.length == 0){
        demands[0].demandDetails.push(newObj);
      }else if(filterDatasignle.length>0){
        filterDatasignle[0].taxAmount = parseInt(dataTotalLight)
      }
      
    }else{
      demands[0].demandDetails.push(newObj);
    }
      
        }

    if (editableDemandDetailWater && editableDemandDetailWater.length > 0 && editableDemandDetailWater[0].taxHeadMasterCode == this.state.waterTaxObj) {
   
      const dataTotalWater = this.state.waterTax > this.state.totalWaterTax ? this.state.waterTax - this.state.totalWaterTax : this.state.waterTax == this.state.totalWaterTax ? 0.00 : this.state.waterTax - this.state.totalWaterTax;
      let newObj1 = {
        "id": null,
        "demandId": editableDemandDetailWater[0].demandId,
        "taxHeadMasterCode": editableDemandDetailWater[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalWater),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailWater[0].tenantId
      }

      if(this.state.clickCount > 0){
        const filterDatasignleWater = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.waterTaxObj)
        if(filterDatasignleWater.length == 0){
          demands[0].demandDetails.push(newObj1);
        }else if(filterDatasignleWater.length>0){
          filterDatasignleWater[0].taxAmount = parseInt(dataTotalWater)
        }
       
      }else{
        demands[0].demandDetails.push(newObj1);
      }
    }

    if (editableDemandDetailLatrineTax && editableDemandDetailLatrineTax.length > 0 && editableDemandDetailLatrineTax[0].taxHeadMasterCode == this.state.LatrineTaxObj) {
     
      const dataTotalLatt = this.state.LatrineTax > this.state.totalLatrineTax ? this.state.LatrineTax - this.state.totalLatrineTax : this.state.LatrineTax == this.state.totalLatrineTax ? 0.00 : this.state.LatrineTax - this.state.totalLatrineTax;
    
      let newObj2 = {
        "id": null,
        "demandId": editableDemandDetailLatrineTax[0].demandId,
        "taxHeadMasterCode": editableDemandDetailLatrineTax[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalLatt),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailLatrineTax[0].tenantId
      }

      if(this.state.clickCount > 0){
        const filterDatasignleLat = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.LatrineTaxObj)
        if(filterDatasignleLat.length == 0){
          demands[0].demandDetails.push(newObj2);
        }else if(filterDatasignleLat.length >0){
          filterDatasignleLat[0].taxAmount = parseInt(dataTotalLatt)
        }
     
      }else{
        demands[0].demandDetails.push(newObj2);
      }
      

    }
    if (editableDemandDetailDrainageTax && editableDemandDetailDrainageTax.length > 0 && editableDemandDetailDrainageTax[0].taxHeadMasterCode == this.state.DrainageTaxObj) {
     
      const dataTotalDrainageTax = this.state.DrainageTax > this.state.totalDrainageTax ? this.state.DrainageTax - this.state.totalDrainageTax : this.state.DrainageTax == this.state.totalDrainageTax ? 0.00 : this.state.DrainageTax - this.state.totalDrainageTax;
    
      let newObj3 = {
        "id": null,
        "demandId": editableDemandDetailDrainageTax[0].demandId,
        "taxHeadMasterCode": editableDemandDetailDrainageTax[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalDrainageTax),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailDrainageTax[0].tenantId
      }

      if(this.state.clickCount > 0){
        const filterDatasignleDrai = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.DrainageTaxObj)
        if(filterDatasignleDrai.length==0){
          demands[0].demandDetails.push(newObj3);
        }else if(filterDatasignleDrai.length>0){
          filterDatasignleDrai[0].taxAmount = parseInt(dataTotalDrainageTax)
        }
       
      }else{
        demands[0].demandDetails.push(newObj3);
      }
    

    }

    if (editableDemandDetailParkingTax && editableDemandDetailParkingTax.length > 0 && editableDemandDetailParkingTax[0].taxHeadMasterCode == this.state.ParkingTaxObj) {
   
      const dataTotalParkingTax = this.state.ParkingTax > this.state.totalParkingTax ? this.state.ParkingTax - this.state.totalParkingTax : this.state.ParkingTax == this.state.totalParkingTax ? 0.00 : this.state.ParkingTax - this.state.totalParkingTax;
    
      let newObj4 = {
        "id": null,
        "demandId": editableDemandDetailParkingTax[0].demandId,
        "taxHeadMasterCode": editableDemandDetailParkingTax[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalParkingTax),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailParkingTax[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlePraking = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.ParkingTaxObj)
        if(filterDatasignlePraking.length==0){
          demands[0].demandDetails.push(newObj4);
        }else if(filterDatasignlePraking.length >0){
          filterDatasignlePraking[0].taxAmount = parseInt(dataTotalParkingTax)
        }
      
      }else{
        demands[0].demandDetails.push(newObj4);
      }
    

    }

    if (editableDemandDetailSolidWasteUserCharges && editableDemandDetailSolidWasteUserCharges.length > 0 && editableDemandDetailSolidWasteUserCharges[0].taxHeadMasterCode == this.state.SolidWasteUserChargesObj) {

      const dataTotalSolidWasteUserCharges = this.state.SolidWasteUserCharges > this.state.totalSolidWasteUserCharges ? this.state.SolidWasteUserCharges - this.state.totalSolidWasteUserCharges : this.state.SolidWasteUserCharges == this.state.totalSolidWasteUserCharges ? 0.00 : this.state.SolidWasteUserCharges - this.state.totalSolidWasteUserCharges;
      
      let newObj5 = {
        "id": null,
        "demandId": editableDemandDetailSolidWasteUserCharges[0].demandId,
        "taxHeadMasterCode": editableDemandDetailSolidWasteUserCharges[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalSolidWasteUserCharges),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailSolidWasteUserCharges[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignleSolidWasteUserChargesObj = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.SolidWasteUserChargesObj)
        if(filterDatasignleSolidWasteUserChargesObj.length== 0){
          demands[0].demandDetails.push(newObj5);
        }else if(filterDatasignleSolidWasteUserChargesObj.length>0){
          filterDatasignleSolidWasteUserChargesObj[0].taxAmount = parseInt(dataTotalSolidWasteUserCharges)
        }
       
      }else{
        demands[0].demandDetails.push(newObj5);
      }
    
    

    }

    if (editableDemandDetailotherDues && editableDemandDetailotherDues.length > 0 && editableDemandDetailotherDues[0].taxHeadMasterCode == this.state.otherDuesObj) {
     
      const dataTotalotherDues = this.state.otherDues > this.state.totalOtherDues ? this.state.otherDues - this.state.totalOtherDues : this.state.otherDues == this.state.totalOtherDues ? 0.00 : this.state.otherDues - this.state.totalOtherDues;
      
      let newObj6 = {
        "id": null,
        "demandId": editableDemandDetailotherDues[0].demandId,
        "taxHeadMasterCode": editableDemandDetailotherDues[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalotherDues),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailotherDues[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlotherDues = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.otherDuesObj)
        if(filterDatasignlotherDues.length == 0){
          demands[0].demandDetails.push(newObj6);
        }else if(filterDatasignlotherDues.length>0){
          filterDatasignlotherDues[0].taxAmount = parseInt(dataTotalotherDues)
        }
       
      }else{
        demands[0].demandDetails.push(newObj6);
      }
     

    }

    if (editableDemandDetailinterest && editableDemandDetailinterest.length > 0 && editableDemandDetailinterest[0].taxHeadMasterCode == this.state.interestObj) {
  
      const dataTotalInterest = this.state.interest > this.state.totalInterest ? this.state.interest - this.state.totalInterest : this.state.interest == this.state.totalInterest ? 0.00 : this.state.interest - this.state.totalInterest;
     
      let newObj7 = {
        "id": null,
        "demandId": editableDemandDetailinterest[0].demandId,
        "taxHeadMasterCode": editableDemandDetailinterest[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotalInterest),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailinterest[0].tenantId
      }

      if(this.state.clickCount > 0){
        const filterDatasignlInterest = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.interestObj)
        if(filterDatasignlInterest.length== 0){
          demands[0].demandDetails.push(newObj7);
        } else if(filterDatasignlInterest.length>0){
          filterDatasignlInterest[0].taxAmount = parseInt(dataTotalInterest)
        }
      
      }else{
        demands[0].demandDetails.push(newObj7);
      }
     

    }

    if (editableDemandDetailserviceTax && editableDemandDetailserviceTax.length > 0 && editableDemandDetailserviceTax[0].taxHeadMasterCode == this.state.serviceTaxObj) {
     
      const dataTotaltotalServiceTax = this.state.serviceTax > this.state.totalServiceTax ? this.state.serviceTax - this.state.totalServiceTax : this.state.serviceTax == this.state.totalServiceTax ? 0.00 : this.state.serviceTax - this.state.totalServiceTax;
    
      let newObj8 = {
        "id": null,
        "demandId": editableDemandDetailserviceTax[0].demandId,
        "taxHeadMasterCode": editableDemandDetailserviceTax[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotaltotalServiceTax),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailserviceTax[0].tenantId
      }

      if(this.state.clickCount > 0){
        const filterDatasignlserviceTax = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.serviceTaxObj)
        if(filterDatasignlserviceTax.length== 0){
          demands[0].demandDetails.push(newObj8);
        } else if(filterDatasignlserviceTax.length>0){
          filterDatasignlserviceTax[0].taxAmount = parseInt(dataTotaltotalServiceTax)
        }
     
      }else{
        demands[0].demandDetails.push(newObj8);
      }
     
    

    }
    if (editableDemandDetailUsageExemption && editableDemandDetailUsageExemption.length > 0 && editableDemandDetailUsageExemption[0].taxHeadMasterCode == this.state.UsageExemptionObj) {

      const dataTotaltotallUsageExemption = this.state.UsageExemption > this.state.totalUsageExemption ? this.state.UsageExemption - this.state.totalUsageExemption : this.state.UsageExemption == this.state.totalUsageExemption ? 100.00 : this.state.UsageExemption - this.state.totalUsageExemption;
    
      let newObj9 = {
        "id": null,
        "demandId": editableDemandDetailUsageExemption[0].demandId,
        "taxHeadMasterCode": editableDemandDetailUsageExemption[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotaltotallUsageExemption),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailUsageExemption[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlUsageExemption = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.UsageExemptionObj)
        if(filterDatasignlUsageExemption.length== 0){
          demands[0].demandDetails.push(newObj9);
        } else if(filterDatasignlUsageExemption.length>0){
          filterDatasignlUsageExemption[0].taxAmount = parseInt(dataTotaltotallUsageExemption)
        }
      
      }else{
        demands[0].demandDetails.push(newObj9);
      }
    

    }
    if (editableDemandDetailOwnershipExemption && editableDemandDetailOwnershipExemption.length > 0 && editableDemandDetailOwnershipExemption[0].taxHeadMasterCode == this.state.ownershipExemptionObj) {
  
      const dataTotaltotallOwnershipExemption = this.state.ownershipExemption > this.state.totalOwnershipExemption ? this.state.ownershipExemption - this.state.totalOwnershipExemption : this.state.ownershipExemption == this.state.totalOwnershipExemption ? 100.00 : this.state.ownershipExemption - this.state.totalOwnershipExemption;
    
      let newObj10 = {
        "id": null,
        "demandId": editableDemandDetailOwnershipExemption[0].demandId,
        "taxHeadMasterCode": editableDemandDetailOwnershipExemption[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotaltotallOwnershipExemption),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailOwnershipExemption[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlownershipExemption = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.ownershipExemptionObj)
        if(filterDatasignlownershipExemption.length == 0){
          demands[0].demandDetails.push(newObj10);
        }else if(filterDatasignlownershipExemption.length>0){
          filterDatasignlownershipExemption[0].taxAmount = parseInt(dataTotaltotallOwnershipExemption)
        }
      
      }else{
        demands[0].demandDetails.push(newObj10);
      }
   

    }
    if (editableDemandDetailRebate && editableDemandDetailRebate.length > 0 && editableDemandDetailRebate[0].taxHeadMasterCode == this.state.rebateObj) {
    
      const dataTotaltotallRebate = this.state.rebate > this.state.totalRebate ? this.state.rebate - this.state.totalRebate : this.state.rebate == this.state.totalRebate ? 0.00 : this.state.rebate - this.state.totalRebate;
 
      let newObj11 = {
        "id": null,
        "demandId": editableDemandDetailRebate[0].demandId,
        "taxHeadMasterCode": editableDemandDetailRebate[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotaltotallRebate),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailRebate[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlrebate = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.rebateObj)
        if(filterDatasignlrebate.length == 0){
          demands[0].demandDetails.push(newObj11);
        }else if(filterDatasignlrebate.length >0){
          filterDatasignlrebate[0].taxAmount = parseInt(dataTotaltotallRebate)
        }
      
      }else{
        demands[0].demandDetails.push(newObj11);
      }
     

    }
    if (editableDemandDetailPenalty && editableDemandDetailPenalty.length > 0 && editableDemandDetailPenalty[0].taxHeadMasterCode == this.state.penaltyObj) {
    
      const dataTotaltotallPenalty = this.state.penalty > this.state.totalPenalty ? this.state.penalty - this.state.totalPenalty : this.state.penalty == this.state.totalPenalty ? 0.00 : this.state.penalty - this.state.totalPenalty;
    
      let newObj12 = {
        "id": null,
        "demandId": editableDemandDetailPenalty[0].demandId,
        "taxHeadMasterCode": editableDemandDetailPenalty[0].taxHeadMasterCode,
        "taxAmount": parseInt(dataTotaltotallPenalty),
        "collectionAmount": 0.00,
        "additionalDetails": null,
        "auditDetails": null,
        "tenantId": editableDemandDetailPenalty[0].tenantId
      }
      if(this.state.clickCount > 0){
        const filterDatasignlpenaltyObj = demands[0].demandDetails.filter(item=>item.id == null&&item.taxHeadMasterCode ==this.state.penaltyObj)
        if(filterDatasignlpenaltyObj.length == 0){
          demands[0].demandDetails.push(newObj12);
        }else if(filterDatasignlpenaltyObj.length>0){
          filterDatasignlpenaltyObj[0].taxAmount = parseInt(dataTotaltotallPenalty)
        }
       
      }else{
        demands[0].demandDetails.push(newObj12);
      }
    

    }
    else {
      if (this.state.holdingObj == "PT_HOLDING_TAX") {
        if (editableDemandDetail.length == 0) {
          const datatotalNew = this.state.holdingtax > this.state.totalHoldingtax ? this.state.holdingtax - this.state.totalHoldingtax : this.state.holdingtax == this.state.totalHoldingtax ? 0.00 : this.state.holdingtax - this.state.totalHoldingtax;
      
          newTaxHead.taxAmount = datatotalNew
          newTaxHead.taxHeadMasterCode = "PT_HOLDING_TAX"

          demands[0].demandDetails.push(newTaxHead);
        }
      }
      if (this.state.lightTaxObj == "PT_LIGHT_TAX") {
        if (editableDemandDetailLight.length == 0) {
          const dataTotalLightNew = this.state.lightTax > this.state.TotalLightTax ? this.state.lightTax - this.state.TotalLightTax : this.state.lightTax == this.state.TotalLightTax ? 0.00 : this.state.lightTax - this.state.TotalLightTax;
       
          let newObjNew = {

            "taxHeadMasterCode": this.state.lightTaxObj,
            "taxAmount": parseInt(dataTotalLightNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew);
        }
      }
      if (this.state.waterTaxObj == "PT_WATER_TAX") {
        if (editableDemandDetailWater.length == 0) {

          const dataTotalWaterNew = this.state.waterTax > this.state.totalWaterTax ? this.state.waterTax - this.state.totalWaterTax : this.state.waterTax == this.state.totalWaterTax ? 0.00 : this.state.waterTax - this.state.totalWaterTax;
         
          let newObjNew1 = {
            "taxHeadMasterCode": this.state.waterTaxObj,
            "taxAmount": parseInt(dataTotalWaterNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,
          }
          demands[0].demandDetails.push(newObjNew1);
        }
      }

      if (this.state.DrainageTaxObj == "PT_DRAINAGE_TAX") {
        if (editableDemandDetailDrainageTax.length == 0) {

          const dataTotalDrainageTaxNew = this.state.DrainageTax > this.state.totalDrainageTax ? this.state.DrainageTax - this.state.totalDrainageTax : this.state.DrainageTax == this.state.totalDrainageTax ? 0.00 : this.state.DrainageTax - this.state.totalDrainageTax;
        
          let newObjNew3 = {

            "taxHeadMasterCode": this.state.DrainageTaxObj,
            "taxAmount": parseInt(dataTotalDrainageTaxNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew3);
        }
      }

      if (this.state.LatrineTaxObj == "PT_LATRINE_TAX") {
        if (editableDemandDetailLatrineTax.length == 0) {

          const dataTotalLatNew = this.state.LatrineTax > this.state.totalLatrineTax ? this.state.LatrineTax - this.state.totalLatrineTax : this.state.LatrineTax == this.state.totalLatrineTax ? 0.00 : this.state.LatrineTax - this.state.totalLatrineTax;
       
          let newObjNew2 = {
            "taxHeadMasterCode": this.state.LatrineTaxObj,
            "taxAmount": parseInt(dataTotalLatNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,
          }
          demands[0].demandDetails.push(newObjNew2);
        }
      }
      if (this.state.ParkingTaxObj == "PT_PARKING_TAX") {
        if (editableDemandDetailParkingTax.length == 0) {

          const dataTotalParkingTaxNew = this.state.ParkingTax > this.state.totalParkingTax ? this.state.ParkingTax - this.state.totalParkingTax : this.state.ParkingTax == this.state.totalParkingTax ? 0.00 : this.state.ParkingTax - this.state.totalParkingTax;
         
          let newObjNew4 = {
            "taxHeadMasterCode": this.state.ParkingTaxObj,
            "taxAmount": parseInt(dataTotalParkingTaxNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,
          }
          demands[0].demandDetails.push(newObjNew4);
        }
      }
      if (this.state.SolidWasteUserChargesObj == "PT_SOLID_WASTE_USER_CHARGES") {
        if (editableDemandDetailSolidWasteUserCharges.length == 0) {

          const dataTotalSolidWasteUserChargesNew = this.state.SolidWasteUserCharges > this.state.totalSolidWasteUserCharges ? this.state.SolidWasteUserCharges - this.state.totalSolidWasteUserCharges : this.state.SolidWasteUserCharges == this.state.totalSolidWasteUserCharges ? 0.00 : this.state.SolidWasteUserCharges - this.state.totalSolidWasteUserCharges;
         
          let newObjNew5 = {

            "taxHeadMasterCode": this.state.SolidWasteUserChargesObj,
            "taxAmount": parseInt(dataTotalSolidWasteUserChargesNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew5);
        }
      }

      if (this.state.interestObj == "PT_INTEREST") {
        if (editableDemandDetailinterest.length == 0) {

          const dataTotalInterestNew = this.state.interest > this.state.totalInterest ? this.state.interest - this.state.totalInterest : this.state.interest == this.state.totalInterest ? 0.00 : this.state.interest - this.state.totalInterest;
        
          let newObjNew6 = {
            "taxHeadMasterCode": this.state.interestObj,
            "taxAmount": parseInt(dataTotalInterestNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew6);
        }
      }
      if (this.state.serviceTaxObj == "PT_SERVICE_TAX") {
        if (editableDemandDetailserviceTax.length == 0) {

          const dataTotaltotalServiceTaxNew = this.state.serviceTax > this.state.totalServiceTax ? this.state.serviceTax - this.state.totalServiceTax : this.state.serviceTax == this.state.totalServiceTax ? 0.00 : this.state.serviceTax - this.state.totalServiceTax;
       
          let newObjNew7 = {

            "taxHeadMasterCode": this.state.serviceTaxObj,
            "taxAmount": parseInt(dataTotaltotalServiceTaxNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew7);
        }
      }
      if (this.state.otherDuesObj == "PT_OTHER_DUES") {
        if (editableDemandDetailotherDues.length == 0) {
          const dataTotalotherDuesNew = this.state.otherDues > this.state.totalOtherDues ? this.state.otherDues - this.state.totalOtherDues : this.state.otherDues == this.state.totalOtherDues ? 0.00 : this.state.otherDues - this.state.totalOtherDues;
        
          let newObjNew8 = {

            "taxHeadMasterCode": this.state.otherDuesObj,
            "taxAmount": parseInt(dataTotalotherDuesNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew8);
        }
      }
      if (this.state.UsageExemptionObj == "PT_USAGE_EXCEMPTION") {
        if (editableDemandDetailUsageExemption.length == 0) {
          const dataTotaltotallUsageExemptionNew = this.state.UsageExemption > this.state.totalUsageExemption ? this.state.UsageExemption - this.state.totalUsageExemption : this.state.UsageExemption == this.state.totalUsageExemption ? 100.00 : this.state.UsageExemption - this.state.totalUsageExemption;
      
          let newObj9 = {

            "taxHeadMasterCode": this.state.UsageExemptionObj,
            "taxAmount": parseInt(dataTotaltotallUsageExemptionNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObj9);
        }
      }
      if (this.state.ownershipExemptionObj == "PT_OWNERSHIP_EXCEMPTION") {
        if (editableDemandDetailOwnershipExemption.length == 0) {
          const dataTotaltotallOwnershipExemptionNew = this.state.ownershipExemption > this.state.totalOwnershipExemption ? this.state.ownershipExemption - this.state.totalOwnershipExemption : this.state.ownershipExemption == this.state.totalOwnershipExemption ? 100.00 : this.state.ownershipExemption - this.state.totalOwnershipExemption;

          let newObjNew10 = {
            "taxHeadMasterCode": this.state.ownershipExemptionObj,
            "taxAmount": parseInt(dataTotaltotallOwnershipExemptionNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew10);
        }
      }
      if (this.state.penaltyObj == "PT_PENALTY") {
        if (editableDemandDetailPenalty.length == 0) {
          const dataTotaltotallPenaltyNew = this.state.penalty > this.state.totalPenalty ? this.state.penalty - this.state.totalPenalty : this.state.penalty == this.state.totalPenalty ? 0.00 : this.state.penalty - this.state.totalPenalty;
        
          let newObjNew12 = {

            "taxHeadMasterCode": this.state.penaltyObj,
            "taxAmount": parseInt(dataTotaltotallPenaltyNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew12);
        }
      }
      if (this.state.rebateObj == "PT_REBATE") {
        if (editableDemandDetailPenalty.length == 0) {
          const dataTotaltotallRebateNew = this.state.rebate > this.state.totalRebate ? this.state.rebate - this.state.totalRebate : this.state.rebate == this.state.totalRebate ? 0.00 : this.state.rebate - this.state.totalRebate;
       
          let newObjNew11 = {

            "taxHeadMasterCode": this.state.rebateObj,
            "taxAmount": parseInt(dataTotaltotallRebateNew),
            "collectionAmount": 0.00,
            "additionalDetails": null,
            "auditDetails": null,

          }
          demands[0].demandDetails.push(newObjNew11);
        }
      }
    }

    try {
      // store.dispatch(showSpinner())
      let validtionCheck = this.checkvalidation()

      let updatedRes = validtionCheck == true ? await updateDemand(demands) :  "";

      if (updatedRes && updatedRes.Demands && updatedRes.Demands.length > 0) {

        const route = `/wns/acknowledgement?purpose=update&status=success&connectionNumber=${consumerCode}&tenantId=${tenantId}`;
        store.dispatch(
          setRoute(route)
        )
        store.dispatch(hideSpinner())
      }

    } catch (error) {
    this.setState({clickCount:this.state.clickCount += 1})
      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "",
          labelKey: error.message,
        },
        "error"
      ));
      store.dispatch(hideSpinner())
    }

  }
  onCancelButtonCLick = async() => {
    this.setState({ isEditVisible: false })
    let consumerCode = getQueryArg(window.location.href, "propertyId");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let bService = getQueryArg(window.location.href, "businessService");
    await searchApiCall(store.dispatch, consumerCode, tenantId, bService)
  
  }
  editLastDemandData = async (data, year) => {
    let editYear = new Date(data.taxPeriodFrom).getFullYear()
    data && data.demandDetails.map((item) => {
      switch (item.taxHeadMasterCode) {
        case "PT_HOLDING_TAX":
          this.setState({ holdingtax: item.taxAmount, totalHoldingtax: item.taxAmount })
          break;
        case "PT_LIGHT_TAX":
          this.setState({ lightTax: item.taxAmount, TotalLightTax: item.taxAmount })
          break;
        case "PT_WATER_TAX":
          this.setState({ waterTax: item.taxAmount, totalWaterTax: item.taxAmount })
          break;
        case "PT_DRAINAGE_TAX":
          this.setState({ DrainageTax: item.taxAmount, totalDrainageTax: item.taxAmount })
          break;
        case "PT_LATRINE_TAX":
          this.setState({ LatrineTax: item.taxAmount, totalLatrineTax: item.taxAmount })
          break;
        case "PT_PARKING_TAX":
          this.setState({ ParkingTax: item.taxAmount, totalParkingTax: item.taxAmount })
          break;
        case "PT_SOLID_WASTE_USER_CHARGES":
          this.setState({ SolidWasteUserCharges: item.taxAmount, totalSolidWasteUserCharges: item.taxAmount })
          break;
        case "PT_INTEREST":
          this.setState({ interest: item.taxAmount, totalInterest: item.taxAmount })
          break;
        case "PT_SERVICE_TAX":
          this.setState({ serviceTax: item.taxAmount, totalServiceTax: item.taxAmount })
          break;
        case "PT_OTHER_DUES":
          this.setState({ otherDues: item.taxAmount, totalOtherDues: item.taxAmount })
          break;
        case "PT_USAGE_EXCEMPTION":
          this.setState({ UsageExemption: item.taxAmount, totalUsageExemption: item.taxAmount })
          break;

        case "PT_OWNERSHIP_EXCEMPTION":
          this.setState({ ownershipExemption: item.taxAmount, totalOwnershipExemption: item.taxAmount })
          break;
        case "PT_PENALTY":
          this.setState({ penalty: item.taxAmount, totalPenalty: item.taxAmount })
          break;
        case "PT_REBATE":
          this.setState({ rebate: item.taxAmount, totalRebate: item.taxAmount })
          break;
        default:
          break;
      }
    })
    // })
    if (editYear == year.getFullYear()) {
      this.setState({ isEditVisible: true, editYearWise: editYear })
    }


  }
  render() {
    const { Demands, onActionClick, classes, totalBillAmount } = this.props;
    let editVisiable = false;
    let { isEditVisible } = this.state;


    var currentYear = new Date().getFullYear()

    return (
      <div>
        {Demands.length > 0 ? (
          Demands.map((item, index) => {
            return (
              <div>{
                item && item.status == "ACTIVE" ?
                  <Card className={classes.card}>
                    <CardContent>
                      {item && new Date(item.taxPeriodFrom).getFullYear() >= currentYear ? "" :
                        <div>
                          <div className="linkStyle" onClick={() =>
                            this.editLastDemandData(item, new Date(item.taxPeriodFrom))}>
                            <a
                              style={{
                                height: 36,
                                lineHeight: "auto",
                                minWidth: "inherit",
                                marginLeft: "20px",
                                float: "right",
                                color: "#fe7a51",
                                cursor: "pointer",
                                fontWeight: "bold"
                              }}>{'ADJUST'}
                            </a>
                          </div>



                        </div>


                      }
                      <div>
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item md={4} xs={6}>
                            <LabelContainer
                              labelKey="PT_DEMAND_PAYER_NAME_LABEL"
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                            />
                          </Grid>
                          <Grid item md={8} xs={6}>
                            <Label
                              labelName={item.payername}
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                            />
                          </Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: 12 }}>
                          <Grid item md={4} xs={6}>
                            <LabelContainer
                              labelKey="PT_DEMAND_PERIOD_LABEL"
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                            />
                          </Grid>
                          <Grid item md={8} xs={6}>
                            <Label
                              labelName={`${convertEpochToDate(item.taxPeriodFrom)} - ${convertEpochToDate(item.taxPeriodTo)}`}
                              fontSize={14}
                              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                            />
                          </Grid>
                        </Grid>

                        {Demands.length > 0 && item.status == "ACTIVE" && this.state.isEditVisible === true && this.state.editYearWise === new Date(item.taxPeriodFrom).getFullYear() ?

                          <div>
                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Holding Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  name="holdingtax"
                                  value={this.state.holdingtax}

                                  onChange={this.handleChange}
                                  jsonPath={`PT_HOLDING_TAX`}
                                />
                              </Grid>


                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Light Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="lightTax"

                                  value={this.state.lightTax}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_LIGHT_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Water Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="waterTax"
                                  value={this.state.waterTax}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_WATER_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Drainage Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="DrainageTax"
                                  value={this.state.DrainageTax}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_DRAINAGE_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Latrine Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="LatrineTax"
                                  value={this.state.LatrineTax}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_LATRINE_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Parking Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="ParkingTax"
                                  value={this.state.ParkingTax}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_PARKING_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Solid Waste User Charges"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="SolidWasteUserCharges"
                                  value={this.state.SolidWasteUserCharges}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_SOLID_WASTE_USER_CHARGES`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Interest"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="interest"
                                  value={this.state.interest}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_INTEREST`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Other Dues"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="otherDues"
                                  value={this.state.otherDues}

                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_OTHER_DUES`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Service Tax"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="serviceTax"
                                  value={this.state.serviceTax}
                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_SERVICE_TAX`}
                                />
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Usage Exemption"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="UsageExemption"
                                  value={this.state.UsageExemption}
                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_EDIT_USAGE_EXCEMPTION`}
                                />
                                <div style={{ color: "red" }}>{this.state.errorUsageExemption}</div>
                              </Grid>
                            </Grid>

                            <Grid container >
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={"Ownership Exemption"}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={3} xs={3}>
                                <TextFieldContainer
                                  name="ownershipExemption"
                                  value={this.state.ownershipExemption}
                                  pattern={/^[1-9]\d*(\.\d+)?$/i}
                                  onChange={this.handleChange}
                                  jsonPath={`PT_EDIT_OWNERSHIP_EXCEMPTION`}
                                />
                                <div style={{ color: "red" }}>{this.state.errorOwnershipExemption}</div>
                              </Grid>
                            </Grid>

                            {item && item.demandDetails && item.demandDetails.length > 0 && item.demandDetails.map((taxHead) => {
                              if (taxHead.taxHeadMasterCode == "PT_PENALTY") {
                                return <Grid container >
                                  <Grid item md={4} xs={6}>
                                    <LabelContainer
                                      labelKey={"Penalty"}
                                      fontSize={14}
                                      style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                    />
                                  </Grid>
                                  <Grid item md={3} xs={3}>
                                    <TextFieldContainer
                                      name="penalty"
                                      value={this.state.penalty}
                                      pattern={/^[1-9]\d*(\.\d+)?$/i}
                                      onChange={this.handleChange}
                                      jsonPath={`PT_PENALTY`}
                                    />

                                  </Grid>
                                </Grid>
                              }
                              if (taxHead.taxHeadMasterCode == "PT_REBATE") {
                                return <Grid container >
                                  <Grid item md={4} xs={6}>
                                    <LabelContainer
                                      labelKey={"Rebate"}
                                      fontSize={14}
                                      style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                    />
                                  </Grid>
                                  <Grid item md={3} xs={3}>
                                    <TextFieldContainer
                                      name="rebate"
                                      value={this.state.rebate}
                                      pattern={/^[1-9]\d*(\.\d+)?$/i}
                                      onChange={this.handleChange}
                                      jsonPath={`PT_REBATE`}
                                    />
                                  </Grid>
                                </Grid>

                              }



                            })}




                          </div> :
                          item && item.status === "ACTIVE" && item.demandDetails && item.demandDetails.length > 0 ?
                            (
                              item.demandDetails.map((taxHeadItem) => {
                                return (
                                  <Grid container style={{ marginBottom: 12 }}>
                                    <Grid item md={4} xs={6}>
                                      <LabelContainer
                                        labelKey={taxHeadItem.taxHeadMasterCode}
                                        fontSize={14}
                                        style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                      />
                                    </Grid>
                                    <Grid item md={8} xs={6}>
                                      <Label
                                        labelName={taxHeadItem.taxAmount}
                                        fontSize={14}
                                        style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                                      />
                                    </Grid>


                                  </Grid>


                                )
                              })
                            )
                            : ""}
                        {Demands.length > 0 && this.state.isEditVisible == true && this.state.editYearWise === new Date(item.taxPeriodFrom).getFullYear() ?
                          <Grid container style={{ marginBottom: 12 }}>
                            <Grid item md={4} xs={6}>

                            </Grid>
                            <Grid item md={8} xs={6}>
                              <Button
                                style={{
                                  height: 36,
                                  lineHeight: "auto",
                                  minWidth: "inherit"
                                }}
                                className="assessment-button"
                                variant="contained"
                                color="primary"
                                onClick={() => this.onUpdateButtonCLick(index)}
                              // disabled={this.state.taxRoundOfAmountErr ? true : false}
                              >
                                <LabelContainer
                                  labelName={`UPDATE`}
                                  labelKey=
                                  {`UPDATE`}
                                />
                              </Button>
                              <Button
                                style={{
                                  height: 36,
                                  lineHeight: "auto",
                                  minWidth: "inherit",
                                  marginLeft: "20px"
                                }}
                                className="assessment-button"
                                variant="contained"
                                color="primary"
                                onClick={() => this.onCancelButtonCLick()}
                              >
                                <LabelContainer
                                  labelName={`CANCEL`}
                                  labelKey=
                                  {`CANCEL`}
                                />
                              </Button>
                            </Grid>
                          </Grid> : ""}


                      </div>
                    </CardContent>
                  </Card>
                  : ""
              }
              </div>

            );
          })
        ) : (
          <div style={{
            display: "flex",
            width: "100%",
            height: '50vh',
            alignItems: 'center',
            justifyContent: "center",
            textAlign: "center"
          }}>
            <LabelContainer
              labelKey={"No results Found!"}
            />

          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  const Demands = get(
    state.screenConfiguration.preparedFinalObject,
    "Demands",
    []
  );

  const totalBillAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "totalBillAmountForDemandPT",
    0
  );
  const screenConfig = get(state.screenConfiguration, "screenConfig");


  let newArray = [];
  for (let i = 0; i < Demands.length; i++) {
    newArray.push({ status: Demands[i].status, payername: Demands[i].payer.name, taxPeriodTo: Demands[i].taxPeriodTo, taxPeriodFrom: Demands[i].taxPeriodFrom, demandDetails: sumTaxHeads(Demands[i].demandDetails) })
  }
  //console.log(newArray, "Nero Array")
  return { screenConfig, Demands: newArray, totalBillAmount };
};
const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path)),

    toggleSnackbar: (open, message, variant) => dispatch(toggleSnackbar(open, message, variant))

  };
};
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(DemandAdjust)
);