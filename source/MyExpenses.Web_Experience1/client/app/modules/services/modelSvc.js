(function () {
    'use strict';

    angular.module('expensesApp').factory('modelSvc', [
        'settings',
        'authSvc',
        modelSvc
    ]);

    function modelSvc(settings, authSvc) {

        function addAuthTokenToUrl(url) {
            //return url + '?access_token=' + authSvc.getAuthToken();
            return url;
        }

        function buildPages(paginatedResult) {
            var totalPages = paginatedResult.TotalPages;
            var currentPage = paginatedResult.PageIndex;

            var pages = [];

            for (var i = 0; i < totalPages; i++) {
                pages.push({
                    number: i + 1,
                    pageIndex: i,
                    current: currentPage === i,
                });
            }

            return pages;
        }

        function buildPaginationInfo(paginatedResult) {
            return {
                pageIndex: paginatedResult.PageIndex,
                pageSize: paginatedResult.PageSize,
                totalCount: paginatedResult.TotalCount,
                totalPages: paginatedResult.TotalPages,
                hasPreviousPage: paginatedResult.HasPreviousPage,
                hasNextPage: paginatedResult.HasNextPage,
            };
        }

        function Employee(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var employee = entity;

            employee.fullName = entity.firstName + ' ' + entity.lastName;
            employee.pictureUrl = addAuthTokenToUrl(entity.PictureUrl);

            return employee;
        }

        function ReportsStatusesSummary(entities) {
            var info = [];
            var currentEntity;

            var all = new ReportStatusSummary({ Status: -1, Count: 0 }, true);
            info.push(all);
            var entitiesLenght = entities.length;

            for (var i = 0; i < entitiesLenght; i++) {
                currentEntity = entities[i];
                info.push(new ReportStatusSummary(currentEntity, false));
                all.count += currentEntity.Count;
            }

            return info;
        }

        function ReportStatusSummary(entity, active) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var status = this;

            status.status = entity.Status;
            status.title = getStatusTitle(entity.Status);
            status.count = entity.Count;
            status.order = getStatusShowOrder(entity.Status);
            status.active = active;

            return status;
        }

        function PaginatedList(entity, elementFactory) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var paginatedReportList = this;

            paginatedReportList.paginationInfo = buildPaginationInfo(entity);
            paginatedReportList.pages = buildPages(entity);
            paginatedReportList.items = entity.Items.map(function (item) {
                return new elementFactory(item);
            });

            return paginatedReportList;
        }

        function Report(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var report = this;

            report.purpose = entity.Purpose;
            report.description = entity.Description;
            report.costCenterId = entity.CostCenterId;

            return report;
        }

        function ReportListItem(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var reportList = this;

            reportList.sequenceNumber = entity.SequenceNumber;
            reportList.purpose = entity.Purpose;
            reportList.description = entity.Description;
            reportList.submissionDate = entity.SubmissionDate ? moment(entity.SubmissionDate).format(settings.dateFormat) : '';
            reportList.total = entity.Total;
            reportList.points = entity.Points;
            reportList.statusId = entity.Status;
            reportList.chargeInPoints = entity.ChargeInPoints;
            reportList.status = getStatusTitle(entity.Status);
            reportList.statusClass = getStatusClass(entity.Status);
            reportList.showDetails = false;
            reportList.url = '#/report/' + entity.SequenceNumber;

            return reportList;
        }

        function ReportDetail(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var report = this;

            report.sequenceNumber = entity.SequenceNumber;
            report.purpose = entity.Purpose;
            report.description = entity.Description;
            report.submissionDate = entity.SubmissionDate ? moment(entity.SubmissionDate).format(settings.dateFormat) : '';
            report.total = entity.Total;
            report.points = entity.Points;
            report.statusId = entity.Status;
            report.status = getStatusTitle(entity.Status);
            report.statusClass = getStatusClass(entity.Status);
            report.description = entity.Description;
            report.summary = entity.Summary;
            report.creationDate = moment(entity.CreationDate).format(settings.dateFormat);
            report.chargedInPoints = entity.ChargedInPoints;
            report.chargedIn = entity.ChargedInPoints ? 'Points' : 'Cash';
            report.costCenterId = entity.CostCenterId;
            report.costCenter = entity.CostCenter;
            report.employeeName = entity.EmployeeName;
            report.employeePictureUrl = addAuthTokenToUrl(entity.EmployeePictureUrl);

            return report;
        }

        ReportDetail.prototype.swichPaymentForm = function () {

            this.chargedInPoints = !this.chargedInPoints;
            this.chargedIn = this.chargedInPoints ? 'Points' : 'Cash';

        };

        function TeamReportListItem(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var reportList = this;

            reportList.sequenceNumber = entity.SequenceNumber;
            reportList.purpose = entity.Purpose;
            reportList.description = entity.Description;
            reportList.total = entity.Total;
            reportList.points = entity.Points;
            reportList.chargeInPoints = entity.ChargeInPoints;
            reportList.submissionDate = moment(entity.SubmissionDate).format(settings.dateFormat);
            reportList.employeeName = entity.EmployeeName;
            reportList.employeePictureUrl = addAuthTokenToUrl(entity.EmployeePictureUrl);
            reportList.status = getStatusTitle(entity.Status);
            reportList.statusClass = getStatusClass(entity.Status);
            reportList.showDetails = false;
            reportList.url = '#/team-report/' + entity.SequenceNumber;

            return reportList;
        }

        function ReportListItemSummary(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var reportDetail = this;

            reportDetail.description = entity.Description;
            reportDetail.points = entity.Points;
            reportDetail.total = 0;
            reportDetail.expenseCategoryDetails = entity.ExpenseCategoryDetails.map(function (item) {
                reportDetail.total += item.Total;
                return {
                    category: item.Category, total: item.Total, iconClass: getExpensecategoryIconClass(item.CategoryId)
                };
            });
            reportDetail.total = reportDetail.total;

            return reportDetail;
        }

        function ExpenseCategory(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var expenseCategory = this;

            expenseCategory.id = entity.Id;
            expenseCategory.title = entity.Title;
            expenseCategory.defaultAmount = entity.DefaultAmount;

            return expenseCategory;
        }

        function CostCenter(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var costCenter = this;

            costCenter.id = entity.Id;
            costCenter.code = entity.Code;

            return costCenter;
        }

        function Expense(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var expense = this;

            expense.categoryId = entity.CategoryId;
            expense.title = entity.Title;
            expense.amount = entity.Amount;
            expense.date = moment(entity.Date).format(settings.dateFormat);
            expense.recurrentFrom = entity.RecurrentFrom ? moment(entity.RecurrentFrom).format(settings.dateFormat) : '';
            expense.recurrentTo = entity.RecurrentTo ? moment(entity.RecurrentTo).format(settings.dateFormat) : '';
            expense.notes = entity.Notes;
            expense.receipt = entity.Receipt;
            expense.isSuspicius = entity.IsSuspicius;

            return expense;
        }

        function ExpenseListItem(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var expenseListItem = this;
            expenseListItem.id = entity.ExpenseId;
            expenseListItem.title = entity.Title;
            expenseListItem.date = moment(entity.Date).format(settings.dateFormat);
            expenseListItem.recurrent = entity.Recurrent;
            expenseListItem.categoryId = entity.CategoryId;
            expenseListItem.category = entity.Category;
            expenseListItem.total = entity.Total;
            expenseListItem.receiptUrl = addAuthTokenToUrl(entity.ReceiptUrl);
            expenseListItem.iconClass = getExpensecategoryIconClass(entity.CategoryId);
            expenseListItem.isSuspicius = entity.IsSuspicious;
            expenseListItem.showDetails = false;

            return expenseListItem;
        }

        function ExpenseListItemDetail(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var expenseListItemDetail = this;

            expenseListItemDetail.notes = entity.Notes;
            expenseListItemDetail.points = entity.Points;
            expenseListItemDetail.amount = entity.Amount;
            expenseListItemDetail.totalBonus = entity.TotalBonus;
            expenseListItemDetail.subtotal = (entity.Amount + entity.TotalBonus);
            expenseListItemDetail.recurrentDays = entity.RecurrentDays;

            return expenseListItemDetail;
        }

        function ProductListItem(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var productListItem = this;
            productListItem.id = entity.Id;
            productListItem.title = entity.Title;
            productListItem.price = entity.Price;
            productListItem.externalPicture = entity.ExternalPicture;
            productListItem.description = entity.Description;
            productListItem.additionalInformation = entity.AdditionalInformation;
            productListItem.genre = entity.Genre;
            productListItem.developer = entity.Developer; 
            productListItem.esrb = entity.Esrb;
        }

        function PurchaseHistoryItem(entity) {

            if (!entity) {
                throw new Error("entity must be valid");
            }

            var item = this;

            item.date = entity.Date;
            item.price = entity.Price;
            item.productName = entity.ProductName;
            item.quantity = entity.Quantity;
            item.total = entity.Price * entity.Quantity;

            return item;
        }

        function getExpensecategoryIconClass(categoryId) {
            switch (categoryId) {
                case 1:
                    return 'category-accommodation-icon';
                case 2:
                    return 'category-flight-icon';
                case 3:
                    return 'category-highway-icon';
                case 4:
                    return 'category-meal-icon';
                case 5:
                    return 'category-train-icon';
                default:
                    return '';
            }
        }

        function getStatusTitle(status) {
            switch (status) {
                case -1:
                    return 'All';
                case 0:
                    return 'Unsubmitted';
                case 1:
                    return 'Submitted';
                case 2:
                    return 'Reimbursed';
                case 3:
                    return 'Rejected';
                case 4:
                    return 'Approved';
                default:
                    return '';
            }
        }

        function getStatusShowOrder(status) {
            switch (status) {
                case -1:
                    return 0;
                case 0:
                    return 1;
                case 1:
                    return 2;
                case 2:
                    return 4;
                case 3:
                    return 5;
                case 4:
                    return 3;
                default:
                    return '';
            }
        }

        function getStatusClass(status) {
            switch (status) {
                case 0:
                    return 'status-unsubmitted';
                case 1:
                    return 'status-submitted';
                case 2:
                    return 'status-reimbursed';
                case 3:
                    return 'status-rejected';
                case 4:
                    return 'status-approved';
                default:
                    return '';
            }
        }

        var service = {
            Employee: Employee,
            PaginatedList: PaginatedList,
            ReportsStatusesSummary: ReportsStatusesSummary,
            ReportListItem: ReportListItem,
            TeamReportListItem: TeamReportListItem,
            ReportDetail: ReportDetail,
            ReportListItemSummary: ReportListItemSummary,
            Report: Report,
            ExpenseListItem: ExpenseListItem,
            ExpenseListItemDetail: ExpenseListItemDetail,
            Expense: Expense,
            CostCenter: CostCenter,
            ExpenseCategory: ExpenseCategory,
            ProductListItem: ProductListItem,
            PurchaseHistoryItem: PurchaseHistoryItem
        };

        return service;
    }
}());