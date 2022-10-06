import React from 'react';
import { View , StyleSheet , StatusBar , Image , TouchableWithoutFeedback , Text } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Loader from '../Loader';
import { ScrollView } from 'react-native-gesture-handler';
import Button from '../Button';
import { Icon } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import qs from 'qs';
import AwesomeAlert from 'react-native-awesome-alerts';
import { baseUrl } from '../../constants';
import AsyncStorage from '@react-native-community/async-storage';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { Divider } from 'react-native-elements';
import Header from '../../common/Header'; 
import Footer from '../../common/Footer'; 
export default class SubmitSheet2 extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loader : false,
            qr_code : '',
            time_hours : '',
            time_min : '',
            difficulty_level : 'easy',
            rating: 1,
            remarks : '',
            frontSheetUploaded : false,
            backSheetUploaded : false,
            roughSheetUploaded : false,
            VideoUploaded : false,
            showAlert : false,
            showAlert1 : false,
            error_message : '',
            upload_front_sheet : '',
            upload_back_sheet : '',
            upload_rough_sheet : '',
            upload_video : '',
            student_id : '',
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('student_id').then((student_id)=>{
            this.setState({student_id:student_id});
        })
    }
    showActionSheet = (type) => {
        if(type == "front"){
            this.ActionSheet1.show()
        }else if(type == "back"){
            this.ActionSheet2.show()
        }else if(type == "rough"){
            this.ActionSheet3.show()
        }else if(type == "video"){
            this.ActionSheet4.show()
        }
        
    }
    goBack = () => {
        this.props.navigation.navigate('SheetMenu');
    }
    goToSubmitSuccess = () => {
        this.props.navigation.navigate('ConfirmSubmit',{
            qr_code : this.props.route.params.qr_code
        });
    }
    onStarRatingPress(rating) {
        this.setState({
            rating: rating
        });
    }
    OpenFrontImageCamera = () => {
        this.ActionSheet1.hide();
        ImagePicker.openCamera({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_front_sheet : resp.file,
                            frontSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenBackImageCamera = () => {
        this.ActionSheet2.hide();
        ImagePicker.openCamera({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_back_sheet : resp.file,
                            backSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenRoughSheetCamera = () => {
        this.ActionSheet3.hide();
        ImagePicker.openCamera({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_rough_sheet : resp.file,
                            roughSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenFrontImage = () => {
        this.ActionSheet1.hide();
        ImagePicker.openPicker({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_front_sheet : resp.file,
                            frontSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenBackImage = () => {
        this.ActionSheet2.hide();
        ImagePicker.openPicker({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_back_sheet : resp.file,
                            backSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenRoughSheet = () => {
        this.ActionSheet3.hide();
        ImagePicker.openPicker({
            width : 700,
            height : 800,
            cropping : true,
            freeStyleCropEnabled: true,
            compressImageQuality:0.5,
            mediaType : "photo"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_rough_sheet : resp.file,
                            roughSheetUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'File not uploaded.Try again'});
                }
            });
        });
    }
    OpenVideoUpload = () => {
        ImagePicker.openPicker({
            mediaType : "video"
        }).then((images) => {
            this.setState({showAlert1 : true});
            let uploadData = new FormData();
            uploadData.append('file', { type: images.mime, uri: images.path, name: images.path.split("/").pop() });
            uploadData.append('action','upload_file');
            fetch(baseUrl+'user', {  
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            method: 'POST',
            body: uploadData
            }).then((response) => response.json())
            .then((resp) => { 
                if(resp.status){
                    this.setState(
                        {
                            showAlert1:false,
                            upload_video : resp.file,
                            VideoUploaded : true
                        }
                    );
                }else{
                    this.setState({showAlert:true,error_message:'Video not uploaded.Try again'});
                }
            });
        });
    }
    SubmitSheet = () => {
        if(this.props.route.params.qr_code){
            if(this.props.route.params.time_hours){
                if(this.props.route.params.time_min){
                    if(this.props.route.params.difficulty_level){
                        if(this.props.route.params.rating){
                              if(this.state.upload_front_sheet){
                                    if(this.state.upload_back_sheet){
                                          if(this.state.upload_video){
                                                if(this.state.upload_rough_sheet){
                                                    this.setState({loader : true,error_message:''});  
                                                    fetch(baseUrl+'user', {
                                                        method: 'POST',
                                                        headers: {
                                                            Accept: 'application/json',
                                                            'content-type': 'application/x-www-form-urlencoded',
                                                        },
                                                        body:qs.stringify({ 
                                                            action : 'submitstudentsheets',
                                                            qr_code : this.props.route.params.qr_code,
                                                            time_hours : this.props.route.params.time_hours,
                                                            time_min : this.props.route.params.time_min,
                                                            difficulty_level : this.props.route.params.difficulty_level,
                                                            rating : this.props.route.params.rating,
                                                            remarks : this.props.route.params.remarks,
                                                            upload_front_sheet : this.state.upload_front_sheet,
                                                            upload_back_sheet : this.state.upload_back_sheet,
                                                            upload_video : this.state.upload_video,
                                                            student_id : this.props.route.params.student_id,
                                                            upload_rough_sheet : this.state.upload_rough_sheet,
                                                        })
                                                        }).then((response) => response.json())
                                                        .then((json) => {
                                                        this.setState({loader : false});  
                                                            if(!json.status){
                                                                this.setState({showAlert:true,error_message:json.message});
                                                            }else if(json.status){
                                                               this.props.navigation.navigate('ConfirmSubmit',{
                                                                    qr_code : this.props.route.params.qr_code
                                                                })
                                                            }
                                                        })
                                                        .catch((error) => {
                                                            this.setState({loader : false});  
                                                        });
                                                }else{
                                                   this.setState({showAlert:true,error_message:'Rough sheet is required'});
                                               }
                                            }else{
                                               this.setState({showAlert:true,error_message:'Upload video is required'});
                                           }
                                    }else{
                                        this.setState({showAlert:true,error_message:'Back sheet is required'});
                                    } 
                                }else{
                                    this.setState({showAlert:true,error_message:'Front sheet is required'});
                                } 
                        }else{
                            this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
                            setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
                        } 
                    }else{
                        this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
                        setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
                    }
                }else{
                    this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
                    setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
                }
            }else{
                this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
                setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
            }
        }else{
            this.setState({showAlert:true,error_message:'Invalid Request.Try again'});
            setTimeout(()=>{this.props.navigation.navigate('SubmitSheet')},1200);
        }
    }
    render(){
        const options1 = [
            <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenFrontImageCamera}>
                <View style={styles.listItem}>
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Open Camera</Text>
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback  onPress={this.OpenFrontImage}>
                 <View style={styles.listItem}>
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Pick from Gallery</Text>
                </View>
            </TouchableWithoutFeedback>
        ];
        const options2 = [
            <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenBackImageCamera}>
                 <View style={styles.listItem}>
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Open Camera</Text>
                </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback  onPress={this.OpenBackImage}>
                 <View style={styles.listItem}>
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Pick from Gallery</Text>
                 </View>
            </TouchableWithoutFeedback>
        ];
        const options3 = [
            <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Cancel</Text>,
            <TouchableWithoutFeedback onPress={this.OpenRoughSheetCamera}>
                 <View style={styles.listItem}>
                     <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Open Camera</Text>
                 </View>
            </TouchableWithoutFeedback>,
            <TouchableWithoutFeedback  onPress={this.OpenRoughSheet}>
                 <View style={styles.listItem}>
                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12}}>Pick from Gallery</Text>
                 </View>
            </TouchableWithoutFeedback>
        ];
       
        if(this.state.loader){
            return(
                <Loader />
            )
        }
        return(
            <View style={styles.container}>
                  <StatusBar hidden />
                <AwesomeAlert
                    show={this.state.showAlert}
                    title="Attention!"
                    message={this.state.error_message}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    cancelButtonColor="#b7a3ef"
                    showCancelButton={true}
                    cancelText="Okay"
                    onCancelPressed={() => {
                        this.setState({showAlert:false});
                    }}
                />
                <AwesomeAlert
                    show={this.state.showAlert1}
                    title="Uploading...."
                    showProgress={false}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                />
                 <ActionSheet
                    ref={o => this.ActionSheet1 = o}
                    title={<Text style={{color: '#000', fontSize: 13,fontFamily:'Poppins-SemiBold'}}>Select</Text>}
                    options={options1}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
                 <ActionSheet
                    ref={o => this.ActionSheet2 = o}
                    title={<Text style={{color: '#000', fontSize: 13,fontFamily:'Poppins-SemiBold'}}>Select</Text>}
                    options={options2}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
                 <ActionSheet
                    ref={o => this.ActionSheet3 = o}
                    title={<Text style={{color: '#000', fontSize: 13,fontFamily:'Poppins-SemiBold'}}>Select</Text>}
                    options={options3}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={4}
                    onPress={(index) => { /* do something */ }}
                />
                 <Header title="Submit" title1="Learning Sheet" backScreen="SubmitSheet2"  headerImage="submitSheet" navigation={this.props.navigation} />  
                  <View style={{flex:0.9,justifyContent:'center',alignItems:'center'}}>
                     <ScrollView>
                        <View style={styles.row}>
                            <View style={{width:wp('50')}}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Front Sheet</Text>
                                    <TouchableWithoutFeedback onPress={()=>this.showActionSheet('front')}>
                                        <View style={{marginLeft : '2%',marginTop:'2%'}}>
                                            <Image source={require('../../../assets/front-side.png')}  style={styles.frontImage}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    </View> 
                            </View>  
                            {
                                this.state.frontSheetUploaded &&  <View style={styles.center}>
                                    <View style={styles.row}>
                                        <Icon  name="check-circle" color="green" size={22}/>
                                        <Text style={styles.uploadedText}>Uploaded</Text>
                                    </View>
                                </View>
                            }
                       </View>
                       <View style={{marginTop:10}}>
                          <Divider />
                       </View>
                       
                        <View style={styles.row}>
                            <View style={{width:wp('50')}}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Back Sheet</Text>
                                    <TouchableWithoutFeedback  onPress={()=>this.showActionSheet('back')}>
                                        <View style={{marginLeft : '2%',marginTop:'2%'}}>
                                            <Image source={require('../../../assets/back-side.png')}  style={styles.frontImage}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View> 
                            </View>
                            {
                                this.state.backSheetUploaded &&  <View style={styles.center}>
                                    <View style={styles.row}>
                                        <Icon  name="check-circle" color="green" size={22}/>
                                        <Text style={styles.uploadedText}>Uploaded</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{marginTop:10}}>
                          <Divider />
                       </View>
                        <View style={styles.row}>
                            <View style={{width:wp('50')}}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Rough Sheet</Text>
                                    <TouchableWithoutFeedback onPress={()=>this.showActionSheet('rough')}>
                                        <View style={{marginLeft : '2%',marginTop:'2%'}}>
                                            <Image source={require('../../../assets/rough_sheet.png')}  style={styles.frontImage}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View> 
                            </View> 
                            {
                                this.state.roughSheetUploaded &&  <View style={styles.center}>
                                    <View style={styles.row}>
                                        <Icon  name="check-circle" color="green" size={22}/>
                                        <Text style={styles.uploadedText}>Uploaded</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{marginTop:10}}>
                          <Divider />
                       </View>
                        <View style={styles.row}>
                            <View style={{width:wp('50')}}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Upload Video</Text>
                                    <TouchableWithoutFeedback onPress={this.OpenVideoUpload}>
                                        <View style={{marginLeft : '2%',marginTop:'2%'}}>
                                            <Image source={require('../../../assets/upload_video.png')}  style={styles.frontImage}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                            {
                                this.state.VideoUploaded &&  <View style={styles.center}>
                                    <View style={styles.row}>
                                        <Icon  name="check-circle" color="green" size={22}/>
                                        <Text style={styles.uploadedText}>Uploaded</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={{marginTop:'5%'}}>
                            <Button onPress={this.SubmitSheet}  backgroundColor="#ef1718" buttonTextColor="#ffffff" borderColor="#ef1718" borderWidth={1.5}  text="SUBMIT" />
                        </View>
                        <View style={{padding:'3%'}}></View>
                        </ScrollView>
                    </View>
                <Footer />
            </View>
        )
    }
}
const styles =  StyleSheet.create({
    container:{
        flex : 1,
        backgroundColor : '#ffffff',
    },
    topCurveImageContainer : {
        alignItems : 'flex-end'
    },
    bottomCurve : {
        flex : 0.1,
        justifyContent : 'flex-end'
    },
    bottomCurveImage:{
        width : wp('100'),
        height : hp('12')
    },
    aboutContainer : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    backMainContainer : {
        position : 'absolute',
        top : 30,
        left : 10
    },
    backContainer : {
        justifyContent : 'center',
        alignItems : 'center',
        elevation : 5,
        backgroundColor : '#eeeeee',
        borderRadius : 8
    },
    backIcon : {
        width : 55,
        height : 55
    },
    descContainer : {
        marginLeft : wp('4')
    },
    heading : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    or : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 18,
        color : '#df2238'
    },
    center : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    qrImage : {
        width : 80,
        height : 80
    },
    secondContainer : {
         margin : '7%'
    },
    label : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#000000',
        marginLeft : '2%'
    },
    label1 : {
        fontFamily : 'Poppins-SemiBold',
        fontSize : 13,
        color : '#000000',
        marginLeft : '9%'
    },
    inputContainer : {
        marginTop : '3%',
    },
    row : {
        flexDirection : 'row'
    },
    timeContainer : {
        backgroundColor : '#ececec',
        height : hp('6'),
        width : wp('30'),
        borderRadius : 30,
        justifyContent : 'center',
        alignItems : 'center',
        margin : '1%'
    },
    timeText : {
        fontFamily : 'Poppins-Regular',
        fontSize : 13,
    },
    frontImage : {
        width : 120,
        height : 150
    },
    scanImage : {
        width : 120,
        height : 120,
        position : 'absolute'
    },
    input1:{
        backgroundColor:'#ececec',
        width : wp('75'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-SemiBold'
    },
    input2 : {
        backgroundColor:'#ececec',
        width : wp('30'),
        borderColor : '#ececec',
        borderRadius : 30,
        fontFamily:'Poppins-SemiBold'
    },
    inputContainer1:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        margin : '0.4%'
    },
    inputContainer2:{
        backgroundColor:'#ececec',
        borderRadius : 30,
        paddingLeft : wp('5'),
        margin : '0.4%'
    },
    uploadedText : {
        fontFamily : 'Poppins-SemiBold',
        marginLeft : '2%'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
      },
      textBold: {
        fontWeight: '500',
        color: '#000'
      },
      buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
      },
      buttonTouchable: {
        
      },
      cameraStyle : {
          width : 150,
          height : 50,
      },
      Qrcontainer : {
            flex : 0.3,
            width : 150,
            height : 50,
      },
      listItem : {
            width:wp('93'),
            justifyContent : 'center',
            alignItems : 'center'
      }
})