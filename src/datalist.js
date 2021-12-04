import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "./listitem";

const dataList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.userInput}
      renderItem={(info) => (
        <ListItem
          data={info.item.value}
          onItemPressed={() => props.onItemDeleted(info.item.key)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default dataList;