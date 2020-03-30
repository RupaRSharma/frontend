import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getFeesEstimateCard, getDialogButton } from "../../utils";

import { getReviewTrade,getDeclarationCard } from "./review-trade";
import { getReviewOwner } from "./review-owner";
import { getReviewDocuments } from "./review-documents";

// const estimate = getCommonGrayCard({
//   estimateSection: getFeesEstimateCard({
//     sourceJsonPath: "LicensesTemp[0].estimateCardData"
//   })
// });

const reviewTradeDetails = getReviewTrade(false);

const reviewOwnerDetails = getReviewOwner(false);

const declarationDetails = getDeclarationCard();

// const reviewDocumentDetails = getReviewDocuments();

export const tradeReviewDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "TL_SUMMARY_HEADER"
  }),
  // estimate,
  // viewBreakupButton: getDialogButton(
  //   "VIEW BREAKUP",
  //   "TL_PAYMENT_VIEW_BREAKUP",
  //   "apply"
  // ),
  reviewTradeDetails,
  reviewOwnerDetails
  // ,
  // reviewDocumentDetails
});

export const declarationCard = getCommonCard({
  declarationDetails
});
