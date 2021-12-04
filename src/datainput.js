import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

class PlaceInput extends Component {
  state = {
    input: ""
  };

  inputChangedHandler = val => {
    this.setState({
      input: val
    });
  };

  inputSubmitHandler = () => {
    if (this.state.input.trim() === "") {
      return;
    }

    this.props.onInputAdded(this.state.input);
  };

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ide gépelj"
          value={this.state.input}
          onChangeText={this.inputChangedHandler}
          style={styles.input}
        />
        <Button
          title="Hozzáad"
          style={styles.button}
          onPress={this.inputSubmitHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    width: "70%"
  },
  button: {
    width: "30%"
  }
});

export default PlaceInput;