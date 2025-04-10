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
        const {label, labelStyle, maxLength, textInputStyle, stateHolder, stateFieldName,
            onChangeText,error,...props} = this.props;
        return (
            <View style={{marginBottom:10}}>
                <Text style={[styles.fieldLabel, labelStyle]}>{label}</Text>
                <TextInput 
                    style={[styles.textInput, textInputStyle,error ? {borderColor:'red',borderWidth:1}:{}]}
                    maxLength={maxLength}
                    onChangeText={(inText) => {
                        stateHolder.setState( () => {
                            const obj = {};
                            obj[stateFieldName] = inText;
                            return obj;
                        });
                        if (onChangeText) {
                            onChangeText(inText);
                        }
                    }}
                    {...props}                   
                    />
                    {error && 
                    (<Text style={{color:'red',marginLeft:10,fontSize:12}}>
                        {error}
                    </Text>
                    )}
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
    onChangeText: PropTypes.func,
    error: PropTypes.string
};

export default CustomTextInput;