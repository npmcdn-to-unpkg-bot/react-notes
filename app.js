var NotesBox = React.createClass({

  getNotesFromServer: function() {
    $.ajax({
      url: this.props.notesUrl,
      dataType: 'json',
      success: (data) => {
        this.setState({ data: data });
      },
      failure: (data) => {
        console.error('USER (MCALE) CREATED ERROR: ' + data);
      }
    });
  },

  getInitialState: function() {
    return { data: [] }
  },

  componentDidMount: function() {
    this.getNotesFromServer();
  },

  handleNoteSubmit: function(data) {
    $.ajax({
      url: this.props.notesUrl,
      method: 'POST',
      data: data,
      success: (data) => {
        this.getNotesFromServer();
      }
    });

  },

  render: function() {
    return ( <
      div className = "NotesBox" >
      <
      NotesForm onNoteSubmit = { this.handleNoteSubmit }
      /> <
      NotesData data = { this.state.data }
      /> <
      /div>
    )
  }
});

var NotesForm = React.createClass({

  getInitialState: function() {
    return { note: '', user: '' }
  },

  handleNoteChange: function(event) {
    event.preventDefault();
    this.setState({ note: event.target.value })
  },

  handleUserChange: function(event) {
    event.preventDefault();
    this.setState({ user: event.target.value })
  },

  addPictureToForm: function(event) {
    console.log(event);
  },

  handleSubmit: function(event) {
    event.preventDefault();
    var note = this.state.note.trim();
    var user = this.state.user.trim();

    if (!note || !user) {
      return;
    }

    this.props.onNoteSubmit({ note: note, user: user })

    this.setState({ note: '', user: '' })
  },

  render: function() {
    return ( <
      form action = "Post"
      onSubmit = { this.handleSubmit } >
      <
      h1 >
      <
      input className = "form-control"
      type = "text"
      value = { this.state.user }
      onChange = { this.handleUserChange }
      placeholder = "Put your name here..." / >
      <
      /h1> <
      h1 >
      <
      textarea className = "form-control"
      rows = "5"
      value = { this.state.note }
      onChange = { this.handleNoteChange }
      placeholder = "Put your note here..." / >
      <
      /h1> <
      AddPicButton onPictureAdd = { this.addPictureToForm }
      /> <
      button className = "btn btn-primary btn-block"
      type = "submit" >
      Save Note <
      /button> <
      /form>
    )
  }
});

var NotesData = React.createClass({
      render: function() {
        // TODO: Learn about map()
        var noteNodes = this.props.data.reverse()
          .map((note) => {
              return ( < Note user = { note.user }
                text = { note.text }
                key = { note.id }
                />)
              });
            return ( <
              div > { noteNodes } < /div>
            )
          }
      });

    var Note = React.createClass({
      render: function() {
        return ( <
          div className = 'note' >
          <
          h3 > { this.props.user } <
          /h3> <
          p > { this.props.text } < /p> <
          /div>
        )
      }
    });

    var AddPicButton = React.createClass({

      addPicStyle: {
        display: 'none'
      },

      addPicture: function(e) {
        console.log(e);
        this.props.onPictureAdd(e);
      },

      render: function() {
        return ( <
          label className = "btn btn-primary btn-block" >
          Picture <
          input type = "file"
          style = { this.addPicStyle }
          onChange = { this.addPicture }
          /> <
          /label>
        )
      }
    });

    ReactDOM.render( <
      NotesBox notesUrl = '/api/notes' / > , document.getElementById('app'));
