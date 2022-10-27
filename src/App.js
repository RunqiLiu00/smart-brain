import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import './App.css';
import ParticlesBg from 'particles-bg';
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';


const USER_ID = 'rliu';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'cd0ae68e750a45f6a076a1caf83c919c';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    




const initialState={
  input:'',
  imageUrl:'',
  box:{},
  route: 'signin',
  isSignIn:false,
  user:{
    id:'',
    name:'',
    email:'',
    entries:0,
    joined:''
  }
}
class App extends Component{
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignIn:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  loadUser=(data)=>{
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      joined:data.joined

    }}
   
    )
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response=>response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation=(data)=>{
  
    const clarifaiFace = data.outputs?.[0].data.regions?.[0].region_info.bounding_box;
    // const clarifaiFace = data.outputs;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}
  displayFaceBox=(box)=>{
    console.log(box);
    this.setState({box:box});
  }
  onInputChange=(Event)=>{
    this.setState({input: Event.target.value});
  }

  onBottonSubmit=()=>{
      this.setState({imageUrl:this.state.input});
      
     
      const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": this.state.input
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    
     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      
      // fetch('http://localhost:3000/imageurl',{
      //   method:'post',
      //   headers:{'Content-Type':'application/json'},
      //       body:JSON.stringify({
      //           input:this.state.input
      //       })
      // })
      
      .then(response=>response.json())
      //.then(results=>results.text()) 
      //.then(results=>(JSON.parse(results)))
      .then(response => {
        if(response){
          fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                id:this.state.user.id
            })

          })
          .then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
        
            
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response) )
      }).catch(console.log)
      
      .catch(error => console.log('error', error));



  }

  onRouteChange=(route)=>{
    if (route==='signout'){
      this.setState(initialState)
    }else if(route==='home'){
      this.setState({isSignIn:true})
    }
    this.setState({route: route});
  }

  render(){
    return(
      <div className="App">
        
        <Navigation isSignIn={this.state.isSignIn} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home'
        
          ? <div>
            
            <Logo/>
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} 
            />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onBottonSubmit={this.onBottonSubmit}
            />
            <FaceRecognition box={this.state.box} imageUrl={this.state.input}/>
  
          
            </div>
          :(this.state.route==='signin'
           ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
           :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
           )


          
         

        }
       
        
  
        
         
        <ParticlesBg className='particles' color='#ff8800' type="cobweb" bg={true} /> 

        
      </div>

    );

  }

}


export default App;
