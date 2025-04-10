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

        this.loadPeoples();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress');
    }

    loadPeoples = async () => {
        try {
            const peoples = await AsyncStorage.getItem('peoples');
            const listData = peoples ? JSON.parse(peoples) : [];
            this.setState({listData});
        } catch (error) {
            console.log('Failed to load peoples: ',error);
        }
    }

    deletePeoples = async (item) => {
        try {
            const peoples = await AsyncStorage.getItem('peoples');
            let listData = peoples ? JSON.parse(peoples) : [];
            listData = listData.filter(peoples => peoples.key !== peoples.key);
            await AsyncStorage.setItem('peoples',JSON.stringify(listData));
            this.setState({listData});
            Toast.show({
                text:'People deleted successfully',
                position:'Bottom',
                text1:'People deleted successfully',
                visibilityTime:2000,});
    } catch (error) {
        console.log('Failed to delete people: ',error);
    }
};

    render() {
        return (
            <GluestackUIProvider>
                <View style={styles.listScreenContainer}>
                    <CustomButton
                        text="Add people"
                        width='94%'
                        onPress={() => this.props.navigation.navigate('AddScreen')}
                    />
                    <FlatList
                    style={styles.peoplesList}
                    data={this.state.listData}
                    keyExtractor={(item) => item.key}
                    renderItem={({item}) => (
                        <View style={styles.peoplesContainer}>
                            <Text style={styles.peopleName}>
                            {item.firstName} {item.lastName} ({item.Relationship})
                            </Text>
                            <CustomButton
                                text="Delete"
                                onPress={() => 
                                    Alert.alert("Please confirm", "Are you sure you want to delete this people?",
                                         [
                                            {text: "OK", onPress: () => this.deletePeoples(item)},
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
                firstName: '',
                lastName: '',
                Relationship: '',
                key: `p_${new Date().getTime()}`,
                errors:{}
            };
        };

        validateFirstName = (firstName) => {
            if (!firstName.trim()) {
                return "Please enter first name";
            }
            return null;
        };

        validateLastName = (lastName) => {
            if (!lastName.trim()) {
                return "Please enter last name";
            }
            return null;
        };

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
            const {firstName, lastName, Relationship} = this.state; 
            const errors = {
                firstName: this.validateFirstName(firstName),
                lastName: this.validateLastName(lastName),
                Relationship: !Relationship ? "Please select relationship" : null,
            };

            this.setState({errors});
            return !Object.values(errors).some(error => error !== null);
            };

           
        

        savePeople= async () => {  
            // const {firstName, lastName, Relationship,key} = this.state;
            // if (!firstName || !lastName || !Relationship) {
            //     Alert.alert("Please fill all fields");
            //     return;
            // }
            if (!this.validateAllFields()) {
                const firstErrorField = Object.keys(this.state.errors).find(
                    key => this.state.errors[key]
                );
                if(firstErrorField){
                    Toast.show({
                        type: 'error',
                        position: 'bottom',
                        text1: 'Validation failed',
                        text2: this.state.errors[firstErrorField],
                        visibilityTime: 3000,
                    });
                }
                return;
            }

            try {
                const peoples = await AsyncStorage.getItem('peoples');
                let listData = peoples ? JSON.parse(peoples) : [];
                listData.push(this.state);
                await AsyncStorage.setItem('peoples',JSON.stringify(listData));

                Toast.show({
                    type: 'success',
                    position: 'bottom',
                    text1: 'People saved successfully',
                    visibilityTime: 2000,
                });

                this.props.navigation.navigate('ListScreen');
            } catch (error) {
                console.log('Failed to save people: ',error);
                Toast.show({
                    type: 'error',
                    position: 'bottom',
                    text1: 'Failed to save people',
                    text2: 'Please try again later',
                    visibilityTime: 3000,
                })
            }
        };

        render() {
            const {errors} = this.state;
            return (
                <ScrollView style={styles.addScreenContainer}>
                    <View style={styles.addScreenInnerContainer}>
                        <View style={styles.addScreenFormContainer} >
                            <CustomTextInput
                                label="firstName"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='firstName'
                                onChangeText={(text)=>this.handleInputChange('firstName',text)}
                                error={errors.firstName}
                            />
                            <CustomTextInput
                                label="lastName"
                                maxLength={50}
                                stateHolder={this}
                                stateFieldName='lastName'
                                onChangeText={(text)=>this.handleInputChange('lastName',text)}
                                error={errors.lastName}
                            />
                            <Text style={styles.fieldLabel}>Relationship</Text>
                            <View style={[styles.pickerContainer,
                                errors.Relationship ? {borderColor: "red"} : {}
                            ]}>
                                <Picker 
                                style={styles.picker}
                                selectedValue={this.state.Relationship}
                                onValueChange={(itemValue) => this.handleInputChange('Relationship',itemValue)}
                                >
                                    <Picker.Item label="Select relationship" value="" />
                                        <Picker.Item label="Me" value="Me" />
                                        <Picker.Item label="Family" value="Family" />
                                        <Picker.Item label="Friend" value="Friend" />
                                        <Picker.Item label="Coworker" value="Coworker" />
                                        <Picker.Item label="Other" value="Other" />
                                </Picker>
                            </View>
                            {errors.Relationship && (
                                <Text style={{color: "red", marginLeft: 10, marginTop: 5}}>
                                    {errors.Relationship}
                                </Text> 
                            )}
                        </View>
                        <View style={styles.addScreenButtonContainer}>
                            <CustomButton
                                text="Save"
                                width='40%'
                                onPress={this.savePeople}
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
        
            peoplesList: {
            width: '94%',
        },
    
        peoplesContainer: {
            flexDirection: 'row',marginTop: 4,marginBottom: 4,
            borderColor : "#e0e0e0", borderBottomWidth : 2, alignItems : "center"
        },
    
        peopleName: { flex : 1},
        addScreenContainer: {
            flex: 1,
            backgroundColor: '#fff',
            paddingTop: 20,
            paddingBottom: 20,
        },
        addScreenInnerContainer: {
            width: '94%',
            alignSelf: 'center',
            padding: 20,
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
            marginTop: 10,
            marginLeft: 10,
        },

        pickerContainer: {
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
            marginTop: 20,
        }

            
    });

    const Stack = createStackNavigator();

    const PeopleScreen = () => {
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

export default PeopleScreen;

    

