angular.module('ExpAccount.utility')

.constant('APPCONSTANTS', {
    DocType: 1,

    GetReimburseBillList: 'U9.Cust.GDJT.ISV.ReimburseBillService.IGetReimburseBillListService',
    CreateReimburseBill: 'U9.Cust.GDJT.ISV.ReimburseBillService.ICreateReimburseBillService',
    UpdateReimburseBill: 'U9.Cust.GDJT.ISV.ReimburseBillService.IUpdateReimburseBillService',
    DeleteReimburseBill: 'U9.Cust.GDJT.ISV.ReimburseBillService.IDeleteReimburseBillService',

    GetUser: 'U9.Cust.GDJT.ISV.CommonService.IGetUserService',
    GetDocumentType: 'U9.Cust.GDJT.ISV.CommonService.IGetDocumentTypeService',
    GetProject: 'U9.Cust.GDJT.ISV.CommonService.IGetProjectService',
    GetBondCustomer: 'U9.Cust.GDJT.ISV.CommonService.IGetBondCustomerService',
    GetCostProject: 'U9.Cust.GDJT.ISV.CommonService.IGetCostProjectService',
    GetExpenditureDepartment: 'U9.Cust.GDJT.ISV.CommonService.IGetExpenditureDepartmentService',
    GetExpenditurePerson: 'U9.Cust.GDJT.ISV.CommonService.IGetExpenditurePersonService'
});
