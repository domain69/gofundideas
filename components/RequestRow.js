import React, { Component } from 'react'
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
export default class RequestRow extends Component {
    state = {
        isLoading: false,
        isFinalize: false
    }
    onClick = async (event) => {
        const campaign = Campaign(this.props.address);
        this.setState({ isLoading: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.approveRequest(this.props.id)
                .send(
                    {
                        from: accounts[0]
                    }
                );
        } catch (err) {
            console.log(err)
        }
        this.setState({ isLoading: false });
    }
    onFinalize = async (event) => {
        const campaign = Campaign(this.props.address);
        this.setState({ isFinalize: true });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id)
                .send(
                    {
                        from: accounts[0]
                    }
                );
        } catch (err) {
            console.log(err)
        }
        this.setState({ isFinalize: false });
    }
    render() {

        const { Row, Cell } = Table;
        const { id, request } = this.props;
        const readyFinalize = request.approvalCount > this.props.approversCount / 2;

        return (
            <Row positive={readyFinalize && !request.complete}>
                <Cell>
                    {id}
                </Cell>
                <Cell>
                    {request.description}
                </Cell>
                <Cell>
                    {web3.utils.fromWei(request.value, 'ether')}
                </Cell>
                <Cell>{request.recipient}</Cell>
                <Cell> {request.approvalCount} / {this.props.approversCount}</Cell>
                <Cell>

                    <Button loading={this.state.isLoading} color="green" basic onClick={this.onClick} disabled={request.complete}>Approve</Button>
                </Cell>
                <Cell>
                    <Button basic loading={this.state.isFinalize} onClick={this.onFinalize} disabled={request.complete || !readyFinalize}>Finalize</Button>
                </Cell>
            </Row>
        )
    }
}
