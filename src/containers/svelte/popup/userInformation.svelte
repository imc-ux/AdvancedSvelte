<script lang="ts">
  import '@/styles/core/white.css';
  import '@/styles/core/index.scss';
  import { onMount, onDestroy } from 'svelte';
  import { Box, Text } from '@/components/sveltecomponents';
  import { Image } from '@/components/sveltecomponents/index';
  import { UsersInfo } from '@/vo/userManager';
  import userMgmtMainStore from '@/store/UserMgmtMainStore';
  import { deepClone } from '@/utils/CommonUtils';
  import { autorun } from 'mobx';

  export let params;
  let id: string;
  let name: string;
  let ip: string;
  let userType: string;
  let blockFlag: string;
  let figure: string = '';

  onMount(() => {
    const info: UsersInfo = {};
    info.iPageCount = 20;
    info.iStart = 0;
    info.id = params.userId;
    userMgmtMainStore.getUserList(info);
  });
  onDestroy(() => {
    searchUserList();
  });

  const searchUserList = autorun(() => {
    if (userMgmtMainStore.userListResult) {
      const userList = deepClone(userMgmtMainStore.userListResult);
      if (!userList.error) {
        id = userList.data[0].id;
        name = userList.data[0].name;
        ip = userList.data[0].ip;
        userType = userList.data[0].usertype;
        blockFlag = userList.data[0].blockflag;
        figure = userList.data[0].figure;
      }
    }
  });
</script>

<div>
  <Box>
    <Box class="background_gray_border left_box svelte-lnhus4-font">
      <Text class="left_text">ID</Text>
    </Box>
    <Box f={1} class="border_right_left_top right_box" horizontalAlign="left">
      <Text>{id}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="left_text">姓名</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{name}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="left_text">用户类型</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{userType}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="left_text">注销</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{blockFlag}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="left_text">IP</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Text>{ip}</Text>
    </Box>
  </Box>
  <Box>
    <Box class="background_gray left_box">
      <Text class="left_text">头像</Text>
    </Box>
    <Box f={1} class="border_bottom_right right_box" horizontalAlign="left">
      <Image style="width: 95px;height: 95px" src={figure} />
    </Box>
  </Box>
</div>

<style lang="scss">
  @import '../../../styles/theme/var';
  @import '../../../styles/theme/mixin';

  :global(.background_gray_border) {
    @include themifyListIpt('background-color', $theme-color);
    color: #fff;
    border: 1px solid #dedede !important;
    border-collapse: collapse;
    text-align: center;
  }

  :global(.background_gray) {
    @include themifyListIpt('background-color', $theme-color);
    color: #fff;
    border-right: 1px solid #dedede !important;
    border-left: 1px solid #dedede !important;
    border-bottom: 1px solid #dedede !important;
    text-align: center;
  }

  :global(.left_box) {
    width: 180px !important;
    line-height: 30px !important;
    justify-content: center !important;
    overflow: hidden;
    font-size: 13px;
  }

  :global(.border_right_left_top) {
    border-right: 1px solid #dedede !important;
    border-top: 1px solid #dedede !important;
    border-bottom: 1px solid #dedede !important;
  }

  :global(.right_box) {
    width: 450px !important;
    line-height: 30px;
    padding-left: 15px;
    font-size: 13px;
  }

  :global(.left_img_box) {
    width: 180px !important;
    line-height: 100px !important;
    justify-content: center !important;
    overflow: hidden;
    font-size: 13px;
  }

  :global(.right_img_box) {
    width: 450px !important;
    line-height: 100px;
    padding-left: 15px;
    font-size: 13px;
  }

  :global(.border_bottom_right) {
    border-right: 1px solid #dedede !important;
    border-bottom: 1px solid #dedede !important;
  }
</style>
