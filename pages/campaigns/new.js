import React, { Component } from "react";
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        isLoading: false
    }
    inputMinimumContribution = (event) => {
        this.setState({ minimumContribution: event.target.value })
    }
    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({ isLoading: true, errorMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        }
        catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ isLoading: false });


    };
    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form error={!!this.state.errorMessage} onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Minimun Contribution</label>
                        <Input
                            value={this.state.minimumContribution}
                            onChange={this.inputMinimumContribution}
                            label='(in wei)'
                            labelPosition='right' />

                    </Form.Field>
                    <Message error header="There is some Error" content={this.state.errorMessage} />
                    <Button loading={this.state.isLoading} primary>Create</Button>
                </Form>
            </Layout >
        );
    }
}

export default CampaignNew;