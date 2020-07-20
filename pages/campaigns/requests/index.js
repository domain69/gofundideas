import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button, Message, Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
class ViewAllRequest extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        let requestCount;
        let requests;
        let contributerCount;
        let error = '';
        try {
            requestCount = await campaign.methods.getRequestsCount().call();
            contributerCount = await campaign.methods.approversCount().call();
            requests = await Promise.all(
                Array(parseInt(requestCount)).fill().map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
            );

        }
        catch (err) {
            error = err.message;
            console.log(error)
        }
        return { address, requests, error, contributerCount };
    }
    renderEachRow() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.contributerCount}
                />
            );
        })
    }
    render() {
        const { Header, HeaderCell, Row, Body } = Table;
        return (

            <Layout >
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button icon='add' floated={'right'}>Add Request</Button>
                    </a>
                </Link>
                <h3>All Requests</h3>

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderEachRow()}
                    </Body>
                </Table>
            </Layout>

        );
    }
}
export default ViewAllRequest;