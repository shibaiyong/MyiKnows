
<template>
    <div class="selectcontainer" ref="selectele">
        <input type="text" :value="text" :style="resetStyle" @click="changeStatus"/>
        <slot>
            <!-- <div class="placeholder">hahah</div> -->
        </slot>
        <ul v-show="isShow">
            <li v-for="item in datas" @click="setValue(item)" :key="item.id" :class="[activeid == item.id ? 'actived' :'']">{{item.text}}</li>
        </ul>
    </div>
</template>
<script>
export default {
    name:'select',
    model:{
       prop:'value'
    },
    props:{
        value:[Number,String],
        resetStyle:{
            type:Object,
            default(){
                return {
                    width:"100px",
                    height:"40px"
                }
            }
        },
        datas:Array
    },
    data() {
        return {
            text:'',
            isShow:false,
            activeid:''
        }
    },
    methods:{

        setValue(item){
           this.text=item.text;
           this.activeid = item.id;
           this.$emit('input',item.id);
        },

        initValue(){
            let item = this.datas.filter((item,index)=>{ 
                return item.id == this.value
            })
            this.text = item[0].text;
            this.activeid = item[0].id;
        },
        changeStatus(){
            this.isShow = true
        },
        clickOutSide(){
            document.addEventListener('click',(e) => {
            let flag = this.$refs.selectele.contains(e.target)
                if( !flag ){
                    this.isShow = false
                }
            },true);
        }
    },
    
    mounted(){

        this.initValue();
        this.clickOutSide();
        
    }
    
};
</script>
<style scoped>
    
    .selectcontainer{
        display:inline-block;
    }

    .selectcontainer input{
        border:1px solid red;
    }

    .selectcontainer .actived{
        background:green;
    }

</style>
