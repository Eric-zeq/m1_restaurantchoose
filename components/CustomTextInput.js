import React,{Component} from'react';
import PropTypes from 'prop-types';
import {Platform,StyleSheet,Text,TextInput,View} from 'react-native';

const styles = StyleSheet.create({

    fieldLabel: {
        marginLeft : 10,
    },

    textInput : {
        height : 40, marginLeft : 10, width : '96%',marginBottom:20,
        //case
        ...Platform.select({
            ios: {
                marginTop: 4,paddingLeft: 10,borderRadius: 5,
                borderWidth: 2,borderColor: '#c0c0c0'
            },
            android: {}
            })
    }
});

class CustomTextInput extends Component {
    
    render() {
        const {label, labelStyle, maxLength, textInputStyle, stateHolder, stateFieldName} = this.props;
        return (
            <View>
                <Text style={[styles.fieldLabel, labelStyle]}>{label}</Text>
                <TextInput 
                    style={[styles.textInput, textInputStyle]}
                    maxLength={maxLength}
                    onChangeText={(inText) => stateHolder.setState(
                        () => {
                            const obj = {};
                            obj[stateFieldName] = inText;
                            return obj;
                        }
                    )}
                    />
            </View>
        );
    }
}

CustomTextInput.propTypes = {
    label: PropTypes.string.isRequired,
    labelStyle: PropTypes.object,   
    maxLengthjsx: PropTypes.number,
    textInputStyle: PropTypes.object,
    stateHolder: PropTypes.object.isRequired,
    stateFieldName : PropTypes.string.isRequired,
};

export default CustomTextInput;