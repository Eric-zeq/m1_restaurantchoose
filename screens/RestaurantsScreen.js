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
            };
        };

        saveRestaurant = async () => {  
            const {name, cuisine, price, rating, phoneNumber, address, website, delivery} = this.state;
            if (!name || !cuisine || !price || !rating || !phoneNumber || !address || !website || !delivery) {
                Alert.alert("Please fill all fields");
                return;
            }
            try {
                const restaurants = await AsyncStorage.getItem('restaurants');
                let listData = restaurants ? JSON.parse(restaurants) : [];
                listData.push(this.state);
                await AsyncStorage.setItem('restaurants',JSON.stringify(listData));
                this.props.navigation.navigate('ListScreen');
            } catch (error) {
                console.log('Failed to save restaurant: ',error);
            }
        };

        render() {
            return (
                <ScrollView style={styles.addScreenContainer}>
                    <View style={styles.addScreenInnerContainer}>
                        <View style={styles.addScreenFormContainer} >
                            <CustomTextInput
                                label="Name"
                                maxLength={20}
                                stateHolder={this}
                                stateFieldName='name'
                            />
                            <Text style={styles.fieldLabel}>Cuisine</Text>
                            <View style={styles.pickerContainer}>
                                <Picker 
                                style={styles.picker}
                                selectedValue={this.state.cuisine}
                                onValueChange={(itemValue) => this.setState({cuisine: itemValue})}
                                >
                                        <Picker.Item label="" value="" />
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
                            <Text style={styles.fieldLabel}>Price</Text>
                            <View style={styles.pickerContainer}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.price}
                                    onValueChange={(itemValue) => this.setState({price: itemValue})}
                                >
                                        <Picker.Item label="" value="" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" /> 
                                </Picker>
                            </View>
                            <Text style={styles.fieldLabel}>Rating</Text>
                            <View style={styles.pickerContainer}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.rating}
                                    onValueChange={(itemValue) => this.setState({rating: itemValue})}
                                >
                                        <Picker.Item label="" value="" />
                                        <Picker.Item label="1" value="1" />
                                        <Picker.Item label="2" value="2" />
                                        <Picker.Item label="3" value="3" />
                                        <Picker.Item label="4" value="4" />
                                        <Picker.Item label="5" value="5" /> 
                                </Picker>
                            </View>
                            <CustomTextInput
                                label="Phone"
                                maxLength={20}
                                stateHolder={this}
                                stateFieldName='phoneNumber'
                            />
                            <CustomTextInput
                                label="Address"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='address'
                            />
                            <CustomTextInput
                                label="Website"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='website'
                            />
                            <Text style={styles.fieldLabel}>Delivery?</Text>
                            <View style={styles.pickerContainer}>
                                <Picker 
                                    style={styles.picker}
                                    selectedValue={this.state.delivery}
                                    onValueChange={(itemValue) => this.setState({delivery: itemValue})}
                                >       
                                        <Picker.Item label="" value="" />
                                        <Picker.Item label="Yes" value="Yes" />
                                        <Picker.Item label="No" value="No" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.addScreenButtonContainer}>
                            <CustomButton
                                text="Save"
                                width='40%'
                                onPress={this.saveRestaurant}
                            />
                            <CustomButton
                                text="Cancel"
                                width='40%'
                                onPress={() => this.props.navigation.navigate('ListScreen')}
                            />

                        </View>
                    </View>
                </ScrollView>
            )
        }
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

    


