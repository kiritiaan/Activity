import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../Firebase';
import { collection, addDoc } from 'firebase/firestore';
import LoadingScreen from './LoadingScreen';

export default function AddData({ navigation }) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddData() {
    if (!newTitle || !newDescription) {
      alert('Please enter a title and description.');
      return;
    }
  
    setIsLoading(true);
  
    console.log('Adding data to Firestore...');
  
    try {
      // Get the current date and time
      const now = new Date();
  
      // Add data to Firestore with createdAt field
      const docRef = await addDoc(collection(db, 'Data'), {
        Title: newTitle,
        Description: newDescription,
        createdAt: now
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      setNewTitle('');
      setNewDescription('');
  
      navigation.goBack();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding the document. Please ensure you have an active internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  console.log('newTitle:', newTitle);
  console.log('newDescription:', newDescription);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => {navigation.goBack()}}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.titleInput}
        value={newTitle}
        onChangeText={text => {
          setNewTitle(text);
          console.log('newTitle:', text);
        }}
        placeholder="Title"
      />

      <TextInput
        style={styles.descriptionInput}
        value={newDescription}
        onChangeText={text => {
          setNewDescription(text);
          console.log('newDescription:', text);
        }}
        placeholder="Description"
        multiline
        numberOfLines={5}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleAddData}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {isLoading && <LoadingScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#00aabb',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
    zIndex: -1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'visible',
    borderWidth: 2,
    paddingHorizontal: 20,
    borderColor: '#00aabb',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 30,
    width: 300,
  },
  descriptionInput: {
    borderWidth: 2,
    borderColor: '#00aabb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    marginBottom: 30,
    width: 300,
  },
  submitButton: {
    backgroundColor: '#00aabb',
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});
