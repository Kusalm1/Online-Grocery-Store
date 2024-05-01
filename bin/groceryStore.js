var app = angular.module('myApp', []);
var $rows = $('#prodctTable tr');
app.controller('myCtrl', function ($scope) {
    $scope.userData = localStorage.getItem("loginUserDetails");
    $scope.userData = JSON.parse($scope.userData);
    $scope.userName = $scope.userData.userType;
    const userId = $scope.userData.userId;
    $scope.filterHotelIteam = '';
    var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/groceryStory";
    $scope.orderDetails = {};
    $scope.orderData = {};
    getAdminDetails();
    $("#orderDivId").show();
    $("#biilingId").hide();
    $("#iteamAddDivId").hide();
    $scope.feedBack = {};
    $scope.adminList = [];
    getIteamList();
    $scope.viewOrderTableData = [];
    $scope.cartCount = 0;
    $scope.productOrderList = [];
    $("#feedbackDivId").hide();
    $scope.productData = {};
    $scope.SearchProduct = "";
    $("#comunicationDivId").hide();
    $scope.placeOrder = function (data) {
        $scope.orderDetails = data;
    }
    $scope.selectedStoreData = '';

    function getAdminDetails() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/userRegister.json",
            success: function (response) {
                let loginUserList = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                $scope.adminOriginalList = { ...response };
                $scope.adminList = loginUserList.filter(obj => obj.userType === 'STORE-OWNER');
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.removeProductOrderList = function (data, index) {
        $scope.productOrderList.splice(index, 1);
        $scope.cartCount = $scope.cartCount - 1;
        $scope.cartDetails();
    }
    $scope.addToCart = function (data) {
        $scope.cartCount = $scope.cartCount + 1;
        delete data["$$hashKey"];
        $scope.productOrderList.push(data);
    }
    $scope.cartDetails = function () {
        $scope.toalCost = 0;
        if ($scope.productOrderList.length == 1) {
            $scope.toalCost = $scope.productOrderList[0].price;
        } else {
            $scope.toalCost = $scope.productOrderList.reduce((total, thing) => total + parseInt(thing.price), 0);
        }
    }

    $scope.placedOrder = function () {
        if (isEmpty($scope.droplocation)) {
            alert("Please fill location");
            return false;
        } else {
            let reqstBody = {
                "productOrderList": $scope.productOrderList,
                "price": $scope.toalCost,
                "orderDate": new Date().toISOString().split('T')[0],
                "droplocation": $scope.droplocation,
                "status": "Payment Pending",
                "userOrderData": $scope.userData,
                "adminId": $scope.productOrderList[0].adminId

            };
            delete reqstBody["$hashKey"];
            delete reqstBody["userOrderData"]["$hashKey"];
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/productOrder/" + userId + ".json",
                data: JSON.stringify(reqstBody),
                success: function (response) {
                    alert("Order placed!!!");
                    $('#cartModalId').modal('hide');
                    $scope.cartCount = 0;
                    let orderList = [...$scope.productOrderList];
                    $scope.productOrderList = [];
                    $scope.orderData = {};
                    $scope.droplocation = "";
                    $scope.updateQuantityOfProduct(orderList);
                    //$scope.switchMenu("BILLING", "billingTabId");

                    $scope.$apply();
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.updateQuantityOfProduct = function (productOrderList) {

        let idSet = new Set();
        productOrderList.forEach(obj => idSet.add(obj.productId));
        idSet.forEach((obj) => {
            let data = [];
            data = productOrderList.filter(elm => elm.productId === obj);
            const method_type = 'patch';
            const http_url = URL + '/iteamNames/' + data[0].ownerId + '/' + obj + '.json';
            let requestBody = {};
            requestBody["quantity"] = data[0].quantity - data.length;
            $.ajax({
                type: method_type,
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: http_url,
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $scope.isEdit = false;
                    getIteamList();
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        })


    }

    $scope.updateStatus = function (data) {
        let reqstBody = {
            "status": "Payment Completed"
        };
        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/productOrder/" + data.userOrderData.userId + "/" + data.orderId + ".json",
            data: JSON.stringify(reqstBody),
            success: function (response) {
                alert("Data Updated!!!");
                $scope.switchMenu('HISTORY', 'orderHistoryTabId');
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.feedBackAdd = function () {
        delete $scope.feedBack["$$hashKey"];
        $scope.feedBack["userName"] = $scope.userData.name;
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/feedBack.json",
            data: JSON.stringify($scope.feedBack),
            success: function (response) {
                alert("Feedback added!!!");
                $scope.feedBack = {};
                getfeedBackAdd();

                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function getfeedBackAdd() {
        delete $scope.feedBack["$$hashKey"];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/feedBack.json",
            success: function (response) {
                let feedbackList = [];
                for (let i in response) {
                    let data = response[i];
                    data["commentId"] = i;
                    feedbackList.push(data);
                }
                $scope.feedbackList = [...feedbackList];
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderTableData = function (type) {
        $scope.viewOrderTableData = [];
        let orderList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/productOrder/" + userId + ".json",
            success: function (response) {
                for (let i in response) {
                    let eventData = response[i];
                    eventData["orderId"] = i;
                    orderList.push(eventData);
                }
                $scope.viewOrderTableData = [...orderList];
                //  orderList.filter(function (obj) {
                //     if (type == "BILLING") {
                //         return obj.status === "pending";
                //     } else {
                //         return obj.status != "pending";
                //     }
                //})
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderData = function (data) {
        $("#ammountId").val(data.price);
        $scope.orderDetails = data;

    }

    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        localStorage.clear();
        window.location.href = "groceryStoreLogReg.html";
    }
    function getIteamList() {
        let url = URL + "/iteamNames/" + userId + ".json";
        if ($scope.userName != 'STORE-OWNER') {
            url = URL + "/iteamNames.json";
        }
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: url,
            success: function (lresponse) {
                $scope.productList = [];
                $scope.foodFilterMenuList = [];
                if ($scope.userName == 'STORE-OWNER') {
                    for (let i in lresponse) {
                        let data = lresponse[i];
                        data["productId"] = i;
                        $scope.productList.push(data);
                    }
                } else {
                    for (let i in lresponse) {
                        for (let j in lresponse[i]) {
                            let data = lresponse[i][j];
                            data["productId"] = j;
                            data["adminId"] = i;
                            $scope.productList.push(data);
                        }
                    }
                    $scope.foodFilterMenuList = [...$scope.productList];
                    $scope.filterResturantMenu('');
                    $scope.filterHotelIteam = '';
                }

                $scope.$apply();
                $rows = $('#prodctTable tr');
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.filterResturantMenu = function (id) {
        $scope.productList = [];
        if (id === '') {
            $scope.productList = [];
        } else {
            $scope.productList = $scope.foodFilterMenuList.filter(obj => obj.ownerId === id);
        }
        setTimeout(() => {
            $rows = $('#prodctTable tr');
        }, 100);

    }
    $scope.addIteam = function () {
        if (isEmpty($scope.productData.productName) || isEmpty($scope.productData.productNum) || isEmpty($scope.productData.price) ||
            isEmpty($scope.productData.type) || isEmpty($scope.productData.quantity) || isEmpty($scope.productData.productDescription)) {
            alert('Fill all details');
            return false;
        } else {
            delete $scope.productData["$$hashKey"];

            let method_type = 'post';
            let http_url = URL + "/iteamNames/" + userId + ".json";
            if ($scope.isEdit) {
                method_type = 'patch';
                http_url = URL + '/iteamNames/' + userId + '/' + $scope.productData.productId + '.json';
            } else {
                $scope.productData['ownerId'] = userId;
            }
            $.ajax({
                type: method_type,
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: http_url,
                data: JSON.stringify($scope.productData),
                success: function (response) {
                    $scope.isEdit = false;
                    alert("Operation successful!!!");
                    $("#addEditProductModalId").modal('hide');
                    $scope.productData = {};
                    getIteamList();
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }

    $scope.editProductDetails = function (event, details) {
        const isChecked = event.target.checked;
        $(".edit-check-cls").prop("checked", false);
        $(event.target).prop("checked", isChecked);
        $scope.productData = { ...details };
        if (!isChecked) {
            $scope.productData = {};
            $scope.isEdit = false;
        } else {
            $scope.isEdit = true;
            $scope.productData.productName = details.productName;
            $scope.productData.productNum = details.productNum;
            $scope.productData.price = details.price;
            $scope.productData.type = details.type;
            $scope.productData.quantity = details.quantity;
            $scope.productData.productDescription = details.productDescription;

        }
    }
    $scope.answerUpdate = function (data, index) {
        if (isEmpty($("#answerBoxId-" + index).val())) {
            alert("Please enter your question");
        } else {
            let requestBody = {};
            requestBody["answer"] = $("#answerBoxId-" + index).val();

            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + '/comunicationData/' + data.communicationId + '/.json',
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $("#answerBoxId-" + index).val('');
                    getComunicationData();
                    alert("Operation successful!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }

    $scope.comunicationAdd = function () {
        let requestBody = {};
        delete $scope.selectedStoreData["$$hashKey"];
        delete $scope.userData["$$hashKey"];
        requestBody = {
            "qestion": $("#querriesId").val(),
            "clientData": $scope.userData,
            "storeData": $scope.selectedStoreData
        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/comunicationData.json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $("#querriesId").val('');
                $("#storeId").val();
                alert("Operation successful!!!");
                getComunicationData();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function getComunicationData() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/comunicationData.json",
            success: function (response) {
                let comunicationData = [];
                for (let i in response) {
                    let data = response[i];
                    data["communicationId"] = i;
                    comunicationData.push(data);
                }
                $scope.comunicationData = { ...response };
                $scope.comunicationDataList = comunicationData.filter(obj => obj.userType === 'STORE-OWNER');
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#orderDivId").hide();
        $("#biilingId").hide();
        $("#iteamAddDivId").hide();
        $("#feedbackDivId").hide();
        $("#comunicationDivId").hide();
        if (type == "PRODUCT") {
            $scope.filterHotelIteam = '';
            $("#orderDivId").show();
            getIteamList();

        } else if (type == "HISTORY") {
            $scope.userName == 'STORE-OWNER' ? $scope.getAdminTableData() : $scope.getOrderTableData("HISTORY");
            $("#biilingId").show();

        } else if (type == 'COMMUNICATION') {
            $("#comunicationDivId").show();
            getComunicationData();
        }
        // else if (type == "ADD_ITEAM") {
        //     $("#iteamAddDivId").show();
        //     clearData();

        // }
        else if (type == "FEEDBACK") {
            $("#feedbackDivId").show();
            getfeedBackAdd();
        }
    }
    function isEmpty(value) {
        return value === "" || value === undefined || value === null ? true : false;
    }
    $scope.getAdminTableData = function () {
        $scope.viewOrderTableData = [];
        let productList = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/productOrder.json",
            success: function (response) {
                for (let data in response) {
                    for (let x in response[data]) {
                        let eventData = response[data][x];
                        eventData["userId"] = data;
                        eventData["childUserId"] = x;
                        productList.unshift(eventData);
                    }
                }
                $scope.viewOrderTableData = productList.filter(function (obj) {
                    return obj.productOrderList[0].adminId == userId;
                })
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $(document).ready(function () {
        $('#search').on("keyup", function (e) {
            var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();

            $rows.show().filter(function () {
                var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
                return !~text.indexOf(val);
            }).hide();
        });
    });

});

