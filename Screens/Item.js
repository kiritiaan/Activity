import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { FAB } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../Firebase';
import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';

export default function Item({ navigation, route}) {
  const [data, setData] = useState(Object);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    setLoading(true);
    getData();
  }, []);


  function getData() {
    const docRef = doc(db, 'Data', route.params);
    getDoc(docRef).then((data) => {
      setData(data.data());
      setNewTitle(data.data().Title);
      setNewDescription(data.data().Description);
      setLoading(false);
    }).catch((error) => {
      console.log('Error fetching item data: ' + error);
      navigation.goBack();
    });
  }


  function handleUpdate() {
    if (newTitle.trim() === '' || newDescription.trim() === '') {
      alert('Please enter a Title and Description.');
      return;
    }
    setLoading(true); 
    const docRef = doc(db, 'Data', route.params);
    updateDoc(docRef, {
      Title: newTitle,
      Description: newDescription
    }).then(() => {
      setNewTitle('');
      setNewDescription('');
      getData(); 
      navigation.goBack(); 
    }).catch((error) => {
      let errorMessage = error.message;
      alert(errorMessage); // Show the error message on an alert box
      console.log('Error updating item: ' + errorMessage);
    }).finally(() => {
      setLoading(false); 
    });
  }
  
  function handleDelete() {
  
    setLoading(true);
    const docRef = doc(db, 'Data', route.params);
    deleteDoc(docRef).then(() => {
      navigation.goBack(); 
    }).catch((error) => {
      let errorMessage = error.message;
      alert(errorMessage); // Show the error message on an alert box
      console.log('Error deleting item: ' + errorMessage);
    }).finally(() => {
      setLoading(false); 
    });
  }
  

  return (
    <SafeAreaView style={styles.container}>
      {loading && <LoadingScreen />}
      <TouchableOpacity style={styles.goBackButton} onPress={() => {navigation.goBack()}}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

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

          <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>


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
    zIndex: -1,
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00aabb',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: 992,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    paddingBottom: 20,
    zIndex: -1, 
  },
  titleInput: {
    minWidth: 200,
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
    zIndex: -1,
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
    zIndex: -1,
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
    zIndex: -1,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: -1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    zIndex: -1,
  },
});
