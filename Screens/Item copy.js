
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FAB } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../Firebase';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function Item({ navigation, route}) {
  const [data, setData] = useState(Object);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Fetch the item data from Firebase on mount.
  useEffect(() => {
    getData();
  }, []);

  // Fetch the item data from Firebase and set the state.
  function getData() {
    const docRef = doc(db, 'Data', route.params);
    getDoc(docRef).then((data) => {
      setData(data.data());
      setNewTitle(data.data().Title);
      setNewDescription(data.data().Description);
    }).catch((error) => {
      console.log('Error fetching item data: ' + error);
      navigation.goBack();
    });
  }

  // Update the item in Firebase and navigate back to the previous screen.
  function handleUpdate() {
    const docRef = doc(db, 'Data', route.params);
    updateDoc(docRef, {
      Title: newTitle,
      Description: newDescription
    }).then(() => {
      // Reset newTitle and newDescription to avoid re-submitting same content
      setNewTitle('');
      setNewDescription('');
      getData(); // Refresh data after update
      navigation.goBack(); // Go back after successful edit
    }).catch((error) => {
      console.log('Error updating item: ' + error);
    });
  }

  // Delete the item from Firebase and navigate back to the previous screen.
  function handleDelete() {
    const docRef = doc(db, 'Data', route.params);
    deleteDoc(docRef).then(() => {
      navigation.goBack(); // Go back after delete
    }).catch((error) => {
      console.log('Error deleting item: ' + error);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Go back button */}
      <TouchableOpacity style={styles.goBackButton} onPress={() => {navigation.goBack()}}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.titleInput}
          value={newTitle}
          onChangeText={setNewTitle}
        />

        <TextInput
          style={styles.descriptionInput}
          value={newDescription}
          onChangeText={setNewDescription}
          multiline
          numberOfLines={5}
        />
        <View style={styles.buttonsContainer}>
          {/* Edit button */}
          <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00aabb',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: 1, // Added zIndex to bring it to the front
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    paddingBottom: 20,
    zIndex: 0, // Added zIndex to send it to the back
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    overflow: 'visible',
    borderWidth: 2,
    paddingHorizontal: 20,
    borderColor: '#00aabb',
    paddingVertical: 10,
    borderRadius: 5,
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: '#00aabb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
    textAlignVertical: 'top',
    marginBottom: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#00aabb',
    padding: 10,
    borderRadius: 5,
    marginRight: 20,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});