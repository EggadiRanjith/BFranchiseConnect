import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

const Dropdown = ({ options, selectedValue, onSelect, isVisible, onClose }) => {
  const handleSelect = (value) => {
    onSelect(value);
    onClose(); // Close the modal after selecting an option
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <FlatList
            data={[{ value: null, label: "Overall" }, ...options]}
            keyExtractor={(item) => item.value ? item.value.toString() : "overall"}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item.value)} style={styles.item}>
                <Text style={selectedValue === item.value ? styles.selectedItemText : styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 5,
    width: '80%',
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  itemText: {
    flex:1,
    fontSize: 16,
    color: '#333',
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default Dropdown;
