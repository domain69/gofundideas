import React, { Component } from 'react';
import { Form, Input, Button, Message } from "semantic-ui-react";
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
class ContributeForm extends Component {
    state = {
        value: '',
        error: '',
        isLoading: false
    };
    onChange = (event) => {
        this.setState({ value: event.target.value })
    };
    onSubmit = async (event) => {
        event.preventDefault();
        const address = this.props.address;
        const campaign = Campaign(address);

        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ isLoading: true, error: '' });
            await campaign.methods.contribute()
                .send(
                    {
                        from: accounts[0],
                        value: web3.utils.toWei(this.state.value, 'ether')
                    }
                );
            Router.replaceRoute(`/campaigns/${address}`);
        } catch (err) {
            this.setState({ error: err.message });
        }
        this.setState({ isLoading: false, value: '' });

    };
    render() {
        return (
            <Form error={!!this.state.error} onSubmit={this.onSubmit}>
                <Form.Field>
                    <label>Amount you want to contribute</label>
                    <Input
                        label='(in ether)'
                        labelPosition='right'
                        value={this.state.value}
                        onChange={this.onChange}

                    />
                </Form.Field>
                <Message error header="There is some Error" content={this.state.error} />
                <Button primary loading={this.state.isLoading}>
                    Contribute!
                </Button>
            </Form>
        );
    }
}

export default ContributeForm;