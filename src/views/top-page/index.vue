<template>
    <div class="outer">
        <el-card class="container">
            <h1 class="title">System Manual</h1>
            <h2>Data Analysis</h2>
            <ul class="content">
                <li>All data are generate randomly by server.</li>
                <li>Only online player count is get and update every second, it is done with websocket.</li>
            </ul>
            <h2>Permission Administration</h2>
            <ol>
                <li class="sub-title">User Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>The role in role distribution is same as the role in role administration.</li>
                        <li>All user in this page can be used to login to this system.</li>
                        <li>User cannot delete own account here.</li>
                        <li>The change of role will only effect when user login again.</li>
                        <li>The relation of user and role is hold in a relation table.</li>
                    </ul>
                </li>
                <li class="sub-title">Role Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>Each role determines menu access permissions.</li>
                        <li>The menu in menu distribution is same as the menu in menu administration.</li>
                        <li>Roles assigned to users cannot be deleted unless unassigned first.</li>
                        <li>The relation of role and menu is hold in a relation table.</li>
                    </ul>
                </li>
                <li class="sub-title">Menu Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>Represent the menu and button that this system have.</li>
                        <li>The delete menu will also be delete in the relation table to the role, which mean the role
                            will lose the access to the deleted menu.</li>
                        <li>Code is assign base on the name of the menu in route.</li>
                    </ul>
                </li>
            </ol>
            <h2>Goods Administration</h2>
            <ol>
                <li class="sub-title">Brand Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>Brand is been used by SPU, SPU have a brand id.</li>
                        <li>Brand been used by SPU cannot be delete.</li>
                        <li>Image of brand is stored in minio, which is local.</li>
                    </ul>
                </li>
                <li class="sub-title">Properties Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>The three category is store in three different table in database, the three level are parent
                            child relation.
                            All level of category cannot be add, edit or delete in this system but you can do it
                            directly in database.</li>
                        <li>Properties is been used in SKU, properties that can be used in SKU is effected by the SPU
                            belong to which "Third category".</li>
                        <li>Properties can only be added to "Third category".</li>
                        <li>Properties can be delete although it is been using by a SKU but this will cause new add or
                            edit SKU cannot find the deleted properties.</li>
                        <li>Properties and its value is store in two different table.</li>
                    </ul>
                </li>
                <li class="sub-title">SPU Administration
                    <ul class="content">
                        <li>Can do add, edit, delete.</li>
                        <li>The three category is same as the one in properties.</li>
                        <li>SPU can only be added to "Third category".</li>
                        <li>SPU that have SKU under it cannot be delete.</li>
                        <li>Add SKU can be only done here.</li>
                        <li>SPU use brand which is same as in brand administration, each SPU belong to one brand.</li>
                        <li>SPU image is store in a different table with SPU.</li>
                        <li>Sale Attr only have three which is fixed. They are define in a java class not from database.
                        </li>
                        <li>The Sale Attr and its value can be apply to SKU under this SPU.</li>
                        <li>Sale Attr and its value is store in two extra table both linked by spu id.</li>
                    </ul>
                </li>
                <li class="sub-title">SKU Administration
                    <ul class="content">
                        <li>Can do edit, delete.</li>
                        <li>A SKU can be disable and enable, default is disable.</li>
                        <li>Each SKU only have one image, this image get image from SPU, they save the url of the image
                            but not id so although SPU delete the image in SPU module, the existing SKU can still use
                            it.</li>
                        <li>SKU store properties and sale attr as a json in the main table so it will not be effected
                            although you have delete it in other module. However, you will not be able to find the
                            deleted properties and sale attr when you add or edit SKU.</li>
                    </ul>
                </li>
            </ol>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.outer {
    width: 100%;

    .container {
        width: 100%;

        .title {
            margin-bottom: 20px;
            font-weight: 600;
        }

        .sub-title {
            font-size: 20px;
            margin: 10px 0;
        }

        .content {
            font-size: 18px;
            margin: 5px 0;
        }
    }
}
</style>