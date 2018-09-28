import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { groupPropType } from '../constants';

export default class GroupForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            checkbox: []
        }
    }
    handleCancelClick = () => {
        window.history.back();
    };

    handleOnchange = ({ target: { checked, id } }) => {
        if (checked) {
            this.setState({ checkbox: [...this.state.checkbox, id] })
        } else {
            this.state.checkbox.includes(id) &&
            this.setState({ checkbox: [...this.state.checkbox.filter(i => i !== id)] })
        }
    }

    handleSubmit = (event) => {
        this.props.onSubmit({
            ...this.props.group,
            name: event.target.groupName.value,
            devices: this.state.checkbox
        });

        event.preventDefault();
    };

    render() {
        const { group } = this.props;

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input type="text"
                           className="form-control"
                           id="groupName"
                           name="groupName"
                           placeholder="Group Name"
                           required
                           defaultValue={group.name} />
                </div>

                <div className="float-right">
                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                    <button type="button" className="btn btn-default" onClick={this.handleCancelClick}>Cancel</button>
                </div>
            </form>
        );
    }
}

GroupForm.defaultProps = {
    group: {
        name: '',
        address: '',
        port: 80
    }
};

GroupForm.propTypes = {
    group: groupPropType,
    onSubmit: PropTypes.func.isRequired
};