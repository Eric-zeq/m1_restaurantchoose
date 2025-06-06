import React from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import {
    Alert,BackHandler,FlatList,Platform,ScrollView,
    StyleSheet,Text,View
} from "react-native";
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStackNavigator} from "@react-navigation/stack";
import {GluestackUIProvider} from '@gluestack-ui/themed-native-base'
import Toast from 'react-native-toast-message'
import Constants from "expo-constants";

class ListScreen extends React.Component {
    constructor(inProps) {
        super(inProps);
        this.state = {listData:[]};
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', () => true);

        this.loadRestaurants();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress');
    }

    loadRestaurants = async () => {
        try {
            const restaurants = await AsyncStorage.getItem('restaurants');
            const listData = restaurants ? JSON.parse(restaurants) : [];
            this.setState({listData});
        } catch (error) {
            console.log('Failed to load restaurants: ',error);
        }
    }

    deleteRestaurant = async (item) => {
        try {
            const restaurants = await AsyncStorage.getItem('restaurants');
            let listData = restaurants ? JSON.parse(restaurants) : [];
            listData = listData.filter(restaurant => restaurant.key !== item.key);
            await AsyncStorage.setItem('restaurants',JSON.stringify(listData));
            this.setState({listData});
            Toast.show({
                text:'Restaurant deleted successfully',
                position:'Bottom',
                text1:'Restaurant deleted successfully',
                visibilityTime:2000,});
    } catch (error) {
        console.log('Failed to delete restaurant: ',error);
    }
};

    render() {
        return (
            <GluestackUIProvider>
                <View style={styles.listScreenContainer}>
                    <CustomButton
                        text="Add Restaurant"
                        width='94%'
                        onPress={() => this.props.navigation.navigate('AddScreen')}
                    />
                    <FlatList
                    style={styles.restaurantsList}
                    data={this.state.listData}
                    keyExtractor={(item) => item.key}
                    renderItem={({item}) => (
                        <View style={styles.restaurantContainer}>
                            <Text style={styles.restaurantName}>{item.name}</Text>
                            <CustomButton
                                text="Delete"
                                onPress={() => 
                                    Alert.alert("Please confirm", "Are you sure you want to delete this restaurant?",
                                         [
                                            {text: "OK", onPress: () => this.deleteRestaurant(item)},
                                            {text: "No"},
                                            {text: "Cancel", style: "cancel"}                                      
                                         ],
                                         {cancelable: true}
                                    )
                                }
                            />
                        </View>
                    )}
                    />
                </View>
            </GluestackUIProvider>
        )}
    }

    class AddScreen extends React.Component {
        constructor(inProps) {
            super(inProps);
            this.state = {
                name: '',
                cuisine: '',
                price: '',
                rating: '',
                phoneNumber: '',
                address: '',
                website: '',
                delivery: '',
                key: `r_${new Date().getTime()}`,
                errors:{}
            };
        };

        // validate
        validateName = (name) => {
            if (!name.trim()) {
                return "Restaurant name is required";
            }
            if (name.length < 2) {
                return "Restaurant name must be at least 2 characters";
            }
            if (!/^[a-zA-Z0-9\s,'-]*$/.test(name)) {
                return "Name contains invalid characters";
              }
              return null;
          
        }

        validatePhoneNumber = (phoneNumber) => {
            if (!phoneNumber.trim()) {
                return "Phone number is required";
            }

            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(phoneNumber)) {
                return "Phone number is invalid";
            }

            return null;

        }

        validateAddress = (address) => {
            if (!address.trim()) {
                return "Address is required";
            }

            if(!/\d+/.test(address) || !/[a-zA-Z]/.test(address))
            {
                return "Address must contain at least one number and one letter";
            }

            if(address.length < 5){
                return "Address must be at least 5 characters long";
            }

            return null;
        }

        validateWebsite = (website) => {
            if (!website.trim()) {
                return "Website is required";
            }

            try {
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                if (!urlRegex.test(website)) {
                    return "please enter a valid website URL (e.g. https://www.example.com)"
                }

                if(!website.startsWith('http://') && !website.startsWith('https://')){
                    return "URL must start with http:// or https://"
                }
            }catch (error) {
                return "please enter a valid website URL (e.g. https://www.example.com)"
            }
            return null;
        }

        handleInputChange = (fieldName, value) => {
            this.setState(prevState => ({
                [fieldName]: value,
                errors: {
                    ...prevState.errors,
                    [fieldName]: null
                }
                }))
            };
       

        validateAllFields = () => {
            const {name, cuisine, price, rating, phoneNumber, address, website, delivery} = this.state;
            const errors = {
                name: this.validateName(name),
                phoneNumber: this.validatePhoneNumber(phoneNumber),
                address: this.validateAddress(address),
                website: this.validateWebsite(website),
                cuisine: !cuisine ? "Cuisine is required" : null,
                price: !price ? "Price is required" : null,
                rating: !rating ? "Rating is required" : null,
                delivery: !delivery ? "Delivery is required" : null,
            };

            this.setState({errors});
            return !Object.values(errors).some(error => error !== null);
        };


        saveRestaurant = async () => {  
            
            if (!this.validateAllFields()) {
                const firstErrorField = Object.keys(this.state.errors).find(
                    key => this.state.errors[key]);
                if(firstErrorField){
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: 'Validation Error',
                        text2: this.state.errors[firstErrorField],
                        visibilityTime: 3000,
                    });
                }
                return;
            
            };

            // const {name, cuisine, price, rating, phoneNumber, address, website, delivery} = this.state;
            // if (!name || !cuisine || !price || !rating || !phoneNumber || !address || !website || !delivery) {
            //     Alert.alert("Please fill all fields");
            //     return;
            // }
            try {
                const restaurants = await AsyncStorage.getItem('restaurants');
                let listData = restaurants ? JSON.parse(restaurants) : [];
                listData.push(this.state);
                await AsyncStorage.setItem('restaurants',JSON.stringify(listData));

                Toast.show({
                    type:'success',
                    position: 'bottom',
                    text1: 'Restaurant added successfully',
                    visibilityTime: 2000,
                });

                this.props.navigation.navigate('ListScreen');
            } catch (error) {
                console.log('Failed to save restaurant: ',error);
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Failed to save restaurant',
                    text2: 'Please try again later',
                    visibilityTime: 3000,
                });
            };
        };
        
        render() {
            const {errors} = this.state;
            return (
                <ScrollView style={styles.addScreenContainer}>
                    <View style={styles.addScreenInnerContainer}>
                        <View style={styles.addScreenFormContainer} >
                            <CustomTextInput
                                label="Name"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='name'
                                onChangeText={(text)=>this.handleInputChange('name',text)}
                                error = {errors.name}
                            />
                            <Text style={styles.fieldLabel}>Cuisine</Text>
                            <View style={[styles.pickerContainer,
                                  errors.cuisine ? {borderColor: "red"}:{}]}>
                                <Picker 
                                style={styles.picker}
                                selectedValue={this.state.cuisine}
                                onValueChange={(itemValue) => this.handleInputChange('cuisine',itemValue)}
                                >
                                        <Picker.Item label="Select a cuisine..." value="" />
                                        <Picker.Item label="Algerian" value="Algerian" />
                                        <Picker.Item label="American" value="American" />
                                        <Picker.Item label="BBQ" value="BBQ" />
                                        <Picker.Item label="Belgian" value="Belgian" />
                                        <Picker.Item label="Brazilian" value="Brazilian" />
                                        <Picker.Item label="British" value="British" />
                                        <Picker.Item label="Cajun" value="Cajun" />
                                        <Picker.Item label="Canadian" value="Canadian" />
                                        <Picker.Item label="Chinese" value="Chinese" />
                                        <Picker.Item label="Cuban" value="Cuban" />
                                        <Picker.Item label="Egyptian" value="Egyptian" />
                                        <Picker.Item label="Filipino" value="Filipino" />
                                        <Picker.Item label="French" value="French" />
                                        <Picker.Item label="German" value="German" />
                                        <Picker.Item label="Greek" value="Greek" />
                                        <Picker.Item label="Haitian" value="Haitian" />
                                        <Picker.Item label="Hawaiian" value="Hawaiian" />
                                        <Picker.Item label="Indian" value="Indian" />
                                        <Picker.Item label="Irish" value="Irish" />
                                        <Picker.Item label="Italian" value="Italian" />
                                        <Picker.Item label="Japanese" value="Japanese" />
                                        <Picker.Item label="Jewish" value="Jewish" />
                                        <Picker.Item label="Kenyan" value="Kenyan" />
                                        <Picker.Item label="Korean" value="Korean" />
                                        <Picker.Item label="Latvian" value="Latvian" />
                                        <Picker.Item label="Libyan" value="Libyan" />
                                        <Picker.Item label="Mediterranean" value="Mediterranean" />
                                        <Picker.Item label="Mexican" value="Mexican" />
                                        <Picker.Item label="Mormon" value="Mormon" />
                                        <Picker.Item label="Nigerian" value="Nigerian" />
                                        <Picker.Item label="Other" value="Other" />
                                        <Picker.Item label="Peruvian" value="Peruvian" />
                                        <Picker.Item label="Polish" value="Polish" />
                                        <Picker.Item label="Portuguese" value="Portuguese" />
                                        <Picker.Item label="Russian" value="Russian" />
                                        <Picker.Item label="Salvadorian" value="Salvadorian" />
                                        <Picker.Item label="Sandwiche Shop" value="Sandwiche Shop" />
                                        <Picker.Item label="Scottish" value="Scottish" />
                                        <Picker.Item label="Seafood" value="Seafood" />
                                        <Picker.Item label="Spanish" value="Spanish" />
                                        <Picker.Item label="Steak House" value="Steak House" />
                                        <Picker.Item label="Sushi" value="Sushi" />
                                        <Picker.Item label="Swedish" value="Swedish" />
                                        <Picker.Item label="Tahitian" value="Tahitian" />
                                        <Picker.Item label="Thai" value="Thai" />
                                        <Picker.Item label="Tibetan" value="Tibetan" />
                                        <Picker.Item label="Turkish" value="Turkish" />
                                        <Picker.Item label="Welsh" value="Welsh" />
                                </Picker>
                            </View>
                            {errors.cuisine && (
                                <Text style={{color: "red", marginLeft: 10}}>
                                    {errors.cuisine}
                                </Text>)}

                            <Text style={styles.fieldLabel}>Price</Text>
                            <View style={[styles.pickerContainer,
                                    errors.price ? {borderColor: "red"}:{}]}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.price}
                                    onValueChange={(itemValue) => this.handleInputChange('price',itemValue)}
                                >
                                        <Picker.Item label="Select a price range..." value="" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" /> 
                                </Picker>
                            </View>
                            {errors.price && (
                                <Text style={{color: "red", marginLeft: 10,marginBottom:10}}>
                                    {errors.price}
                                </Text>)}
                            <Text style={styles.fieldLabel}>Rating</Text>
                            <View style={[styles.pickerContainer,
                                    errors.rating ? {borderColor: "red"}:{}]}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.rating}
                                    onValueChange={(itemValue) => this.handleInputChange('rating',itemValue)}
                                >
                                        <Picker.Item label="Select a rating..." value="" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" /> 
                                </Picker>
                            </View>
                            {errors.rating && (
                                <Text style={{color: "red", marginLeft: 10,marginBottom:10}}>
                                    {errors.rating}
                                </Text>)}

                            <CustomTextInput
                                label="Phone Number"
                                maxLength={20}
                                stateHolder={this}
                                stateFieldName='phoneNumber'
                                onChangeText={(text)=>this.handleInputChange('phoneNumber',text)}
                                keyboardType="phone-pad"
                                error = {errors.phoneNumber}
                            />

                            <CustomTextInput
                                label="Address"
                                maxLength={100}
                                stateHolder={this}
                                stateFieldName='address'
                                onChangeText={(text)=>this.handleInputChange('address',text)}
                                error = {errors.address}
                            />

                            <CustomTextInput
                                label="Website"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='website'
                                onChangeText={(text)=>this.handleInputChange('website',text)}
                                keyboardType="url"
                                autoCapitalize="none"
                                error = {errors.website}
                            />

                            <Text style={styles.fieldLabel}>Delivery?</Text>
                            <View style={[
                                styles.pickerContainer,
                                errors.delivery ? {borderColor: "red"}:{}
                            ]}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.delivery}
                                    onValueChange={(itemValue) => this.handleInputChange('delivery',itemValue)}
                                >       
                                        <Picker.Item label="Select delivery option..." value="" />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="No" value="No" />
                                </Picker>
                            </View>
                            {errors.delivery && (
                                <Text style={{color: "red", marginLeft: 10,marginBottom:10}}>
                                    {errors.delivery}
                                </Text>)}
                        </View>
                        <View style={styles.addScreenButtonContainer}>
                            <CustomButton
                                text="Save"
                                width='44%'
                                onPress={this.saveRestaurant}
                            />
                            <CustomButton
                                text="Cancel"
                                width='44%'
                                onPress={() => this.props.navigation.navigate('ListScreen')}
                            />

                        </View>
                    </View>
                </ScrollView>
            )
        };
    };

    const styles = StyleSheet.create({

        listScreenContainer: {
            flex: 1,alignItems: 'center',justifyContent: 'center',
            ...Platform.select({
                ios: {
                    paddingTop: Constants.statusBarHeight,
                },
                android: {}
                })
            },
        
        restaurantsList: {
            width: '94%',
        },
    
        restaurantContainer: {
            flexDirection: 'row',marginTop: 4,marginBottom: 4,
            borderColor : "#e0e0e0", borderBottomWidth : 2, alignItems : "center"
        },
    
        restaurantName: { flex : 1},
        addScreenContainer: {
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: 10,
            paddingBottom: 10,
        },
        addScreenInnerContainer: {
            width: '94%',
            alignSelf: 'center',
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },

        addScreenFormContainer: {
            flexDirection: 'column',
            width: '100%',
        },

        fieldLabel: {
            fontSize: 16,
            marginLeft: 10,
        },

        pickerContainer: {
            marginLeft: 10,
            width: '96%',
        },
        picker: {
            height: 60,
            backgroundColor: '#fff',
            borderColor: '#c0c0c0',
            paddingLeft: 10,
        },

        addScreenButtonContainer: {
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            // marginTop: 20,
        }
            
    });

    const Stack = createStackNavigator();

    const RestaurantsScreen = () => {
        return (
            <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="ListScreen"
            >
            <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="AddScreen" component={AddScreen} />
            </Stack.Navigator>
        )
    }

export default RestaurantsScreen;

    


