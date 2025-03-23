<template>
    <header class="header-index">

        <div id="main-wrapper">

            <!--**********************************
            Nav header start
        ***********************************-->
            <div class="nav-header">
                <div class="nav-header">
                    <a href="index.html" class="brand-logo">
                        <img class="logo-abbr" src="/admin_static/images/logo.png" alt="">
                        <img class="logo-compact" src="/admin_static/images/logo-text.png" alt="">
                        <img class="brand-title" src="/admin_static/images/logo-text.png" alt="">
                    </a>
                </div>

                <div class="nav-control">
                    <div class="hamburger">
                        <span class="line"></span><span class="line"></span><span class="line"></span>
                    </div>
                </div>
            </div>

            <!--**********************************
            Header start
        ***********************************-->
            <div class="header">
                <div class="header-content">
                    <nav class="navbar navbar-expand">
                        <div class="collapse navbar-collapse justify-content-between">
                            <div class="header-left">
                                <div class="search_bar dropdown">
                                    <span class="search_icon p-3 c-pointer" data-toggle="dropdown">
                                        <i class="mdi mdi-magnify"></i>
                                    </span>
                                    <div class="dropdown-menu p-0 m-0">
                                        <form>
                                            <input class="form-control" type="search" placeholder="Search"
                                                aria-label="Search">
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <ul class="navbar-nav header-right">
                                <li class="nav-item dropdown notification_dropdown">
                                    <a class="nav-link" href="#" role="button" data-toggle="dropdown">
                                        <i class="mdi mdi-bell"></i>
                                        <div class="pulse-css"></div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <ul class="list-unstyled">
                                            <li class="media dropdown-item">
                                                <span class="success"><i class="ti-user"></i></span>
                                                <div class="media-body">
                                                    <a href="#">
                                                        <p><strong>Martin</strong> has added a <strong>customer</strong>
                                                            Successfully
                                                        </p>
                                                    </a>
                                                </div>
                                                <span class="notify-time">3:20 am</span>
                                            </li>
                                            <li class="media dropdown-item">
                                                <span class="primary"><i class="ti-shopping-cart"></i></span>
                                                <div class="media-body">
                                                    <a href="#">
                                                        <p><strong>Jennifer</strong> purchased Light Dashboard 2.0.</p>
                                                    </a>
                                                </div>
                                                <span class="notify-time">3:20 am</span>
                                            </li>
                                        </ul>
                                        <a class="all-notification" href="#">See all notifications <i
                                                class="ti-arrow-right"></i></a>
                                    </div>
                                </li>
                                <li class="nav-item dropdown header-profile">
                                    <a class="nav-link" href="#" role="button" data-toggle="dropdown">
                                        <i class="mdi mdi-account"></i>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right">
                                        <a href="./app-profile.html" class="dropdown-item">
                                            <i class="icon-user"></i>
                                            <span class="ml-2">Profile </span>
                                        </a>
                                        <a href="./email-inbox.html" class="dropdown-item">
                                            <i class="icon-envelope-open"></i>
                                            <span class="ml-2">Inbox </span>
                                        </a>
                                        <a href="./page-login.html" class="dropdown-item">
                                            <i class="icon-key"></i>
                                            <span class="ml-2">Logout </span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>


            <!--**********************************
            Sidebar start
        ***********************************-->
            <div class="quixnav">
                <div class="quixnav-scroll">
                    <ul class="metismenu" id="menu">
                        <li class="nav-label first">Main Menu</li>

                        <li><router-link to="/manage/shop/orders" class="has-arrow" href="javascript:void()"
                                aria-expanded="false"><i class="bi bi-cart"></i><span
                                    class="nav-text">商城管理</span></router-link>
                            <ul aria-expanded="false">
                                <li><a href="table-bootstrap-basic.html">商品列表</a></li>
                                <li><a href="table-bootstrap-basic.html">庫存管理</a></li>
                                <li><router-link to="/manage/shop/orders">訂單管理</router-link></li>
                                <li><a href="table-datatable-basic.html">優惠券管理</a></li>
                                <li><a href="table-datatable-basic.html">客服管理</a></li>
                                <li><a href="table-datatable-basic.html">報表分析</a></li>
                            </ul>
                        </li>
                        <li><router-link to="/manage/vendor" class="has-arrow" href="javascript:void()"
                                aria-expanded="false"><i class="bi bi-cart"></i><span
                                    class="nav-text">商家管理</span></router-link>
                            <ul aria-expanded="false">
                                <li><router-link to="/manage/vendor">商家列表</router-link></li>
                                <li><a href="table-bootstrap-basic.html">認證申請管理</a></li>
                                <li><router-link to="/manage/vendor">訂單管理</router-link></li>

                            </ul>
                        </li>
                        <li class="nav-label"></li>
                    </ul>
                </div>
            </div>
        </div>

    </header>
</template>
<script setup>



</script>
<style></style>