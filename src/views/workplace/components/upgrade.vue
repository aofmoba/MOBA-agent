<template>
    <a-modal
        v-model:visible="curVisible"
        modal-class="upgrade-modal"
        :title="$t('workplace.upgrade.title')"
        :unmount-on-close="true"
        :mask-closable="false"
    >
        <a-form :model="inviCode" layout="vertical">
            <a-form-item field="invicode" :label="$t('login.register.code')+'：'">
                <a-input v-model="inviCode.cvalue" onfocus />
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="editCancel">{{ $t('login.modal.cancel2') }}</a-button>
            <a-button :loading="loading" type="primary" @click="upUserGrade">{{
                $t('login.modal.ok2')
            }}</a-button>
        </template>
    </a-modal>
</template>
  
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue';
import axios from 'axios';
import { watch, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';

const { t } = useI18n();
const emit = defineEmits(['cancelup']);
const { loading, setLoading } = useLoading(false);
const curVisible = ref<boolean>(false)
const inviCode = reactive({
    cvalue: ''
});
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
watch(()=>props.visible,(newV,oldV)=>{
    curVisible.value = newV
    inviCode.cvalue = ''
},{immediate: true,deep: true})


const editCancel = () => {
    curVisible.value = false
    emit('cancelup',false)
}
const upUserGrade = () => {
    if( !inviCode.cvalue ) return 
    setLoading(true)
    axios
      .post(`/api/business/upGradeDealer?invCode=${inviCode.cvalue}`)
      .then((res: any) => {
        if ( res.data.code === 200 ) {
          Message.success(t('upgrade.success'))
          inviCode.cvalue = ''
          emit('cancelup',false,true)
        }else if( res.data.code === 500 ){
            if( res.data.msg === '邀请码无效' ){
                Message.error(t('upgrade.error'))
            }else if( res.data.msg === '邀请码有误' ){
                Message.error(t('upgrade.error1'))
            }else if( res.data.msg === '七位邀请码不能进行伙伴级账号升级' ){
                Message.error(t('upgrade.error2'))
            }else{
                Message.error(res.data.msg)
            }
        }
      }).finally(()=>{setLoading(false)})
}
</script>

<style lang="less" scoped>
</style>

<style lang="less">
.upgrade-modal{
    width: 460px;
    .arco-modal-header{
        margin-bottom: 20px;
        .arco-modal-title{
            font-size: 18px;
            font-weight: 600;
        }
        .arco-modal-close-btn{
            display: none;
        }
    }
    .arco-modal-body{
        padding: 0 60px 20px;
        .arco-form-item{
            margin-bottom: 0 !important;
        }   
    }
    .arco-modal-footer{
        border: none;
        text-align: center;
    }
}
</style>
