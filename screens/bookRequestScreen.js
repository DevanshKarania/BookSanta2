import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component {
    constructor() {
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            bookName: "",
            reasonToRequest: "",
            isBookRequestActive: "",
            requestedBookName: "",
            bookStatus: "",
            requestId: "",
            userDocId: '',
            docId: ''
        }
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7);
    }
    sendNotification = () => {
        //to get the first name and last name
        db.collection('users').where('emailID', '==', this.state.userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var name = doc.data().firstName
                    var lastName = doc.data().lastName

                    // to get the donor id and book nam
                    db.collection('allNotifications').where('requestId', '==', this.state.requestId).get()
                        .then((snapshot) => {
                            snapshot.forEach((doc) => {
                                var donorId = doc.data().donorId
                                var bookName = doc.data().bookName

                                //targert user id is the donor id to send notification to the user
                                db.collection('allNotifications').add({
                                    "targetedUserId": donorId,
                                    "message": firstName + " " + lastName + " received the book " + bookName,
                                    "notificationStatus": "unread",
                                    "bookName": bookName
                                })
                            })
                        })
                })
            })
    }

    receivedBooks = (bookName) => {
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('receivedBooks').add({
            "userid": userId,
            "bookName": bookName,
            "requestId": requestId,
            "bookStatus": "received",

        })
    }



    addRequest = async (bookName, reasonToRequest) => {
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        console.log("state 34: ", this.state)
        db.collection('requestBooks').add({
            "userId": userId,
            "bookName": bookName,
            "reasonToRequest": reasonToRequest,
            "bookStatus": "requested",
            "requestId": randomRequestId,
        })
        await this.getBookRequest()
        db.collection('users').where("emailID", "==", userId).get()
            .then()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log("46: ", doc.id)
                    db.collection('users').doc(doc.id).update({
                        isBookRequestActive: true
                    })
                })
            })

        this.setState({
            bookName: '',
            reasonToRequest: ''
        })

        return alert("Book Requested Successfully")
    }

    getBookRequest = () => {
        // getting the requested book
        var bookRequest = db.collection('requestBooks')
            .where('userId', '==', this.state.userId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.data().bookStatus !== "received") {
                        this.setState({
                            requestId: doc.data().requestId,
                            requestedBookName: doc.data().bookName,
                            bookStatus: doc.data().bookStatus,
                            docId: doc.id
                        })
                    }
                })
            })
    }

    getIsBookRequestActive() {
        db.collection('users')
            .where('emailID', '==', this.state.userId)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(doc => {
                    this.setState({
                        isBookRequestActive: doc.data().isBookRequestActive,
                        userDocId: doc.id
                    })
                })
            })
    }
    updateBookRequestStatus = () => {
        //updating the book status after receiving the book
        db.collection('requestBooks').doc(this.state.docId)
            .update({
                bookStatus: 'recieved'
            })

        //getting the  doc id to update the users doc
        db.collection('users').where('emailID', '==', this.state.userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    //updating the doc
                    db.collection('users').doc(doc.id).update({
                        isBookRequestActive: false
                    })
                })
            })


    }

    componentDidMount() {
        this.getBookRequest()
        this.getIsBookRequestActive()

    }

    render() {
        if (this.state.isBookRequestActive === true) {
            return (

                // Status screen

                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
                        <Text>Book Name</Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                    <View style={{ borderColor: "orange", borderWidth: 2, justifyContent: 'center', alignItems: 'center', padding: 10, margin: 10 }}>
                        <Text> Book Status </Text>

                        <Text>{this.state.bookStatus}</Text>
                    </View>

                    <TouchableOpacity style={{ borderWidth: 1, borderColor: 'orange', backgroundColor: "orange", width: 300, alignSelf: 'center', alignItems: 'center', height: 30, marginTop: 30 }}
                        onPress={() => {
                            this.sendNotification()
                            this.updateBookRequestStatus();
                            this.receivedBooks(this.state.requestedBookName)
                        }}>
                        <Text>I recieved the book </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1 }}>
                    <MyHeader title="Request Book" navigation={this.props.navigation} />
                    <KeyboardAvoidingView style={styles.keyBoardStyle}>
                        <TextInput
                            style={styles.formTextInput}
                            placeholder={"enter book name"}
                            onChangeText={(text) => {
                                this.setState({
                                    bookName: text
                                })
                            }}
                            value={this.state.bookName}
                        />
                        <TextInput
                            style={[styles.formTextInput, { height: 300 }]}
                            multiline
                            numberOfLines={8}
                            placeholder={"Why do you need the book"}
                            onChangeText={(text) => {
                                this.setState({
                                    reasonToRequest: text
                                })
                            }}
                            value={this.state.reasonToRequest}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => { this.addRequest(this.state.bookName, this.state.reasonToRequest) }}
                        >
                            <Text>Request</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    keyBoardStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formTextInput: {
        width: "75%",
        height: 35,
        alignSelf: 'center',
        borderColor: '#ffab91',
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
    },
    button: {
        width: "75%",
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: "#ff5722",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    },
}
)