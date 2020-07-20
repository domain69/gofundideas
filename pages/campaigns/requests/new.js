import React, { Component } from "react";
import Layout from '../../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router } from '../../../routes';

class NewRequest extends Component {
    state = {
        description: '',
        value: '',
        recipient: '',
        error: '',
        isLoading: false
    };
    static async getInitialProps(props) {
        const { address } = props.query;
        return { address }
    }
    onChange = (event) => {

        this.setState({ [event.target.name]: event.target.value })
    }
    onSubmit = async (event) => {
        event.preventDefault();
        const address = this.props.address;
        const campaign = Campaign(address);
        const { description, value, recipient } = this.state;
        const valueInWei = web3.utils.toWei(value, 'ether');
        try {
            const accounts = await web3.eth.getAccounts();
            this.setState({ isLoading: true, error: '' });
            await campaign.methods.createRequest(description, valueInWei, recipient)
                .send(
                    {
                        from: accounts[0]
                    }
                );
            Router.pushRoute(`/campaigns/${address}/requests`);
        }
        catch (err) {
            this.setState({ error: err.message })
        }
        this.setState({ isLoading: false });
    }
    render() {
        return (
            <Layout>
                <h3>Add new request</h3>
                <Form error={!!this.state.error} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={this.onChange}
                            name='description'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Amount in ether</label>
                        <Input
                            value={this.state.value}
                            onChange={this.onChange}
                            name='value'
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient address</label>
                        <Input
                            value={this.state.recipient}
                            onChange={this.onChange}
                            name='recipient'
                        />
                    </Form.Field>
                    <Message error header={'Oops! There is some error'} content={this.state.error} />
                    <Button loading={this.state.isLoading}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default NewRequest;